import React from 'react';
import { DndProvider } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { dropped } from './DropLogic'
import HTML5Backend from 'react-dnd-html5-backend'
import ItemTypes from './ItemTypes'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FileReader from './FileReader';
import Papa from 'papaparse';
import Plot from 'react-plotly.js';
import DropView from './DropView.js';
import ParallelCoordinates from './ParallelCoordinates.js';
import './App.css';

class App extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
		selectedData : 1,
		selectedViews : {},
		selectedLayout : undefined,
		csvData: undefined,
		connectAddress: undefined,
		dataRevision: 0,
		ParallelCoordinateSelections: {},
		activeData: {},
		xyTraces: [],
		pvTraces: [],
                pTraces: [],
                pdotTraces: [],
                pdotdotTrace: [],
		ltTraces: [],
		conTraces: [],
		finalDataset : {
			xyTraces: [],
			pvTraces: [],
                        pTraces: [],
                        pdotTraces: [],
                        pdotdotTrace: [],
			ltTraces: [],
			conTraces: [],
		},
	};

	//Bind the "this" context to the handler functions
	this.updateSelectedViews = this.updateSelectedViews.bind(this);
	this.updateSelectedData = this.updateSelectedData.bind(this);
	this.updateSelectedCSV = this.updateSelectedCSV.bind(this);
	this.updateAddress = this.updateAddress.bind(this);
	this.updateSelectedLayout = this.updateSelectedLayout.bind(this);
	this.connectToAddress = this.connectToAddress.bind(this);
	this.updateParallelCoordinateSelections = this.updateParallelCoordinateSelections.bind(this)
  }

  //Handler function for the currently selected views
  updateSelectedViews(views) {
	this.setState({
		selectedViews : views,
		dataRevision : this.state.dataRevision + 1
	});
  }

  increaseDataRevision() {
	this.setState({
		dataRevision : this.state.dataRevision + 1
	});
  }

  //Handler function for the currently selected data point
  updateSelectedData(data) {
  	this.setState({
		selectedData : data
	});
  }


  //Handler function for the currently selected Layout
  updateSelectedLayout(event) {
  	this.setState({
		selectedLayout : event.target.name
	});
  }

  //Handler function for the currently selected data.csv file
  updateSelectedCSV(result) {
	this.setState({
		csvData : result.data,
		activeData: result.data
	});
  }

  //Handler function for the currently selected address
  updateAddress(event) {
	this.setState({
		connectAddress : event.target.value,
	});
  }


  //A way to make selections from the styling calls.
  updateParallelCoordinateSelections(e, trace) {
	try {
		var dimension = Object.keys(e[0])[0].split("[")[1].split("]")[0];
	}
	catch(err) {
		return;
	}
	console.log(dimension)
	try {
		var selections = e[0]["dimensions[" + dimension + "].constraintrange"][0];
	}
	catch(err) {
		var selections = e[0]["dimensions[" + dimension + "].constraintrange"];
	}
	var x = this.state.ParallelCoordinateSelections
	x[trace.dimensions[dimension].label] = selections;
	console.log(selections);
	console.log(trace);
	this.setState({
		ParallelCoordinateSelections: x,
	}, () => this.updateActive());
  }

  //A function to trim down the active selections after a Parallel Coordinate Filtering
  updateActive() {
	var masterList = [...this.state.csvData];
	var trimList = [...this.state.csvData];
	var filters = this.state.ParallelCoordinateSelections;
	for (const filter in filters) {
		//Check what kind of filter we have to deal with
		if(filters[filter] === null){
			//Things to do when the filter is null (has been removed)
			continue;
		} else if (Array.isArray(filters[filter][0])){
			//Things to do when there are multiple filters on one coordinate
			for (const line in masterList){
				var remove = true;
				var relevantValue = masterList[line][filter];
				//Check if the value is in any of the filters
				for (const f in filters[filter]) {
					if(filters[filter][f][0] < relevantValue && relevantValue < filters[filter][f][1]){
						remove = false;
					}
				}
				//If it wasn't in any of the filters remove the line
				if(remove === true){
					//Don't try to remove something that's not there
					if(trimList.indexOf(masterList[line]) === -1){
						continue;
					}
					trimList.splice(trimList.indexOf(masterList[line]), 1);
				}
			}
		} else {
			//Things to do when we have a normal single filter
			for (const line in masterList) {
				var relevantValue = masterList[line][filter];
				if(typeof relevantValue === 'undefined'){
					console.log("Issue getting the relevant value in the csv file for the filter applied\n" +
						"line: " + line + " filter: " + filter);
					continue;
				}
				if(!(filters[filter][0] < relevantValue && relevantValue < filters[filter][1])){
					//Don't try to remove something that's not there
					if(trimList.indexOf(masterList[line]) === -1){
						continue;
					}
					trimList.splice(trimList.indexOf(masterList[line]), 1);
				}
			}
		}
	}

	//Make a new dataset for the xy_traces
	var xy_files = [];
	var xy_traces = [];
	for (const line in trimList) {
		xy_files.push(trimList[line]["FILE_spectra_path"])
	}
	for (const file in xy_files){
		var path = xy_files[file]
		Papa.parse("http://" + this.state.connectAddress + "/" + path, {
			download: true,
			complete: function(results) {
				var x_array = []
				var y_array = []
				for (const line in results["data"]) {
					var point = results["data"][line]
					x_array.push(Number(point[0]));
					y_array.push(Number(point[1]));
				}
				var trace = {x: x_array, y: y_array, type: 'scatter'}
				xy_traces.push(trace);
			}
		});
	}

	var newFinalDataset = JSON.parse(JSON.stringify(this.state.finalDataset));
	newFinalDataset["xyTraces"] = xy_traces;


	this.setState({
		activeData: trimList,
		finalDataset: newFinalDataset,
	});


	this.intervalID = setTimeout(
		() => this.increaseDataRevision(),
		1000
	);

  }

  //Callback to activate the connection and preload the needed data
  connectToAddress(event) {
	Papa.parse("http://" + this.state.connectAddress + "/data.csv" + "?_=" + (new Date).getTime(), {
		download: true,
		header: true,
		transformHeader: (d) => {return d.trim()},
		skipEmptyLines: true,
		complete: (results) => {
			console.log(results);
			this.updateSelectedCSV(results)

			//process azmuthally integrated data
			var xy_files = [];
			var xy_traces = [];
			for (const line in this.state.csvData) {
				xy_files.push(this.state.csvData[line]["FILE_spectra_path"])
			}
			for (const file in xy_files){
				var path = xy_files[file]
				Papa.parse("http://" + this.state.connectAddress + "/" + path, {
					download: true,
					complete: function(results) {
						var x_array = []
						var y_array = []
						for (const line in results["data"]) {
							var point = results["data"][line]
							x_array.push(Number(point[0]));
							y_array.push(Number(point[1]));
						}
						var trace = {x: x_array, y: y_array, type: 'scatter'}
						xy_traces.push(trace);
					}
				});
			}

			//process pressure vs volume data
			var pv_traces = [];
			if(typeof this.state.csvData != "undefined"){
			Papa.parse("http://" + this.state.connectAddress + "/" + this.state.csvData[0]["FILE_pressure_path"], {
				download: true,
				complete: function(results) {
					var x_array = []
					var y_array = []
					for (const line in results["data"]) {
            if(results["data"][line][0] === ""){
              continue;
            }
						x_array.push(Number(results["data"][line][1]));
						y_array.push(Number(results["data"][line][2]));
					}
					var trace = {x: x_array, y: y_array, type: 'scatter'}
					pv_traces.push(trace)
				}
			});
			}

                        //process pressure fit vs frame
                        var p_traces = [];
                        if(typeof this.state.csvData != "undefined"){
                        Papa.parse("http://" + this.state.connectAddress + "/" + this.state.csvData[0]["FILE_pfit_path"], {
                                download: true,
                                complete: function(results) {
                                        var x_array = []
                                        var y_array = []
                                        for (const line in results["data"]) {
            if(results["data"][line][0] === ""){
              continue;
            }
                                                x_array.push(Number(results["data"][line][0]));
                                                y_array.push(Number(results["data"][line][1]));
                                        }
                                        var trace = {x: x_array, y: y_array, type: 'scatter'}
                                        p_traces.push(trace)
                                }
                        });
                        }

                        //process pressure fit derivative vs frame
                        var pdot_traces = [];
                        if(typeof this.state.csvData != "undefined"){
                        Papa.parse("http://" + this.state.connectAddress + "/" + this.state.csvData[0]["FILE_pfitdot_path"], {
                                download: true,
                                complete: function(results) {
                                        var x_array = []
                                        var y_array = []
                                        for (const line in results["data"]) {
            if(results["data"][line][0] === ""){
              continue;
            }
                                                x_array.push(Number(results["data"][line][0]));
                                                y_array.push(Number(results["data"][line][1]));
                                        }
                                        var trace = {x: x_array, y: y_array, type: 'scatter'}
                                        pdot_traces.push(trace)
                                }
                        });
                        }

                        //process pressure fit derivative vs frame
                        var pdotdot_traces = [];
                        if(typeof this.state.csvData != "undefined"){
                        Papa.parse("http://" + this.state.connectAddress + "/" + this.state.csvData[0]["FILE_pfitdotdot_path"], {
                                download: true,
                                complete: function(results) {
                                        var x_array = []
                                        var y_array = []
                                        for (const line in results["data"]) {
            if(results["data"][line][0] === ""){
              continue;
            }
                                                x_array.push(Number(results["data"][line][0]));
                                                y_array.push(Number(results["data"][line][1]));
                                        }
                                        var trace = {x: x_array, y: y_array, type: 'scatter'}
                                        pdotdot_traces.push(trace)
                                }
                        });
                        }

			//process lattice vs time data
			var lt_traces = []
			if(typeof this.state.csvData != "undefined"){
			Papa.parse("http://" + this.state.connectAddress + "/" + this.state.csvData[0]["FILE_lattice_path"], {
				download: true,
				complete: function(results) {
					var x_array = []
					var y_array = []
					for (const line in results["data"]) {
            if(results["data"][line][0] === ""){
              continue;
            }
						x_array.push(Number(results["data"][line][1]));
						y_array.push(Number(results["data"][line][2]));
					}
					var trace = {x: x_array, y: y_array, type: 'scatter'}
					lt_traces.push(trace)
				}
			});
			}

			//process the heatmap/contour diagram data
			var con_traces = []
			if(typeof this.state.csvData != "undefined"){
			Papa.parse("http://" + this.state.connectAddress + "/" + this.state.csvData[0]["FILE_heatmap_path"], {
				download: true,
				complete: function(results) {
					var x_array = []
					var y_array = []
					var z_array = []
					var current_y = 1;
					for (const line in results["data"]) {
						if(line == 0){
							continue;
						}
						if(Number(results["data"][line][1]) == 1){
						x_array.push(Number(results["data"][line][5]));
						}
						y_array.push(Number(results["data"][line][4]));
						if(current_y != Number(results["data"][line][1])){
							current_y = Number(results["data"][line][1])
							z_array.push(y_array);
							y_array = [];
						}
					}
					var trace = {x: x_array, z: z_array, type: 'heatmap', colorscale: "Picnic"}
					con_traces.push(trace)
				}
			});
			}

			this.setState({
				finalDataset : {"xyTraces":xy_traces, "pvTraces":pv_traces, "ltTraces":lt_traces, "conTraces": con_traces, "pTraces":p_traces, "pdotTraces":pdot_traces, "pdotdotTraces":pdotdot_traces},
			});

			this.intervalID = setTimeout(
				() => this.increaseDataRevision(),
				1000
			);

		}
	});




  }

  //This is the primary rendering function for the entire app, everything else cascades from here.
  render () {
	    return (
	    <div className="App">
	  	{/* DndProvider specifies what backend the drag and drop code should use*/}
		<DndProvider backend={HTML5Backend}>
		  <ParallelCoordinates csvData={this.state.csvData} selectionUpdater={this.updateParallelCoordinateSelections}/>
	          <div class="Address">
		    <InputGroup className="mb-3">
	    		<Form.Control size="sm" type="text" placeholder="Enter Database Serving Address"
		    		onChange={this.updateAddress}/>
		    	<InputGroup.Append>
			    <Button variant="primary" size="sm" type="button" onClick={this.connectToAddress}>
				Connect
			    </Button>
		        </InputGroup.Append>
		    </InputGroup>
	         </div>

		  <GridSelector />
		  <DataViewGrid viewUpdater={this.updateSelectedViews}
		    		selectedViews={this.state.selectedViews}
		    		csvData={this.state.csvData}
		    		finalDataset={this.state.finalDataset}
		    		selectedLayout={this.state.selectedLayout}
		    		connectAddress={this.state.connectAddress}
		    		dataRevision={this.state.dataRevision}
		    		selectedDataUpdater={this.updateSelectedData}
		    		selectedData={this.state.selectedData}/>
		  <GridTemplateButton layoutUpdater={this.updateSelectedLayout}/>
		</DndProvider>
	    </div>
	    );
  };
}

{/* The data view selector box */}
function GridSelector() {
	return (
		<div className="GridSelector">
		<DataView type="xyGraph" name="Intensity VS Angle"/>
		<DataView type="image" name="XRD Image"/>
		<DataView type="pvChart" name="Pressure VS Frame"/>
                <DataView type="pChart" name="Pressure Fit VS Frame"/>
                <DataView type="pdotChart" name="Pressure Fit 1st Derivative VS Frame"/>
                <DataView type="pdotdotChart" name="Pressure Fit 2nd Derivative VS Frame"/>
		<DataView type="latticeVSTime" name="Lattice VS Frame"/>
		<DataView type="contourDiagram" name="Contour Diagram"/>
		</div>
	);
}

{/* Drop down button to select different templates */}
function GridTemplateButton(props) {
	return (
		<DropdownButton id="dropdown-basic-button" title="View Selector" size="sm">
  			<Dropdown.Item name="One and Two" onClick={props.layoutUpdater}>One and Two</Dropdown.Item>
  			<Dropdown.Item name="One and One Horizontal" onClick={props.layoutUpdater}>One and One Horizontal</Dropdown.Item>
  			<Dropdown.Item name="One and One Vertical" onClick={props.layoutUpdater}>One and One Vertical</Dropdown.Item>
  			<Dropdown.Item name="Quads" onClick={props.layoutUpdater}>Quads</Dropdown.Item>
		</DropdownButton>
	);
}


function DataViewGrid(props) {
	switch(props.selectedLayout) {
		case 'One and Two':
			return (
				<div className="DataViewGrid">
				<GridOneAndTwo
					selectedViews={props.selectedViews}
		    			finalDataset={props.finalDataset}
					viewUpdater={props.viewUpdater}
		    			selectedDataUpdater={props.selectedDataUpdater}
					selectedData={props.selectedData}
					connectAddress={props.connectAddress}
		    			dataRevision={props.dataRevision}
					csvData={props.csvData}/>
				</div>
			);
		case 'One and One Horizontal':
			return (
				<div className="DataViewGrid">
				<GridOneAndOneHorizontal
					selectedViews={props.selectedViews}
		    			finalDataset={props.finalDataset}
					viewUpdater={props.viewUpdater}
		    			selectedDataUpdater={props.selectedDataUpdater}
					selectedData={props.selectedData}
					connectAddress={props.connectAddress}
		    			dataRevision={props.dataRevision}
					csvData={props.csvData}/>
				</div>
			);
		case 'One and One Vertical':
			return (
				<div className="DataViewGrid">
				<GridOneAndOneVertical
					selectedViews={props.selectedViews}
		    			finalDataset={props.finalDataset}
					viewUpdater={props.viewUpdater}
		    			selectedDataUpdater={props.selectedDataUpdater}
					selectedData={props.selectedData}
					connectAddress={props.connectAddress}
		    			dataRevision={props.dataRevision}
					csvData={props.csvData}/>
				</div>
			);
		case 'Quads':
		default:
			return (
				<div className="DataViewGrid">
				<GridQuads
					selectedViews={props.selectedViews}
		    			finalDataset={props.finalDataset}
					viewUpdater={props.viewUpdater}
		    			selectedDataUpdater={props.selectedDataUpdater}
					selectedData={props.selectedData}
					connectAddress={props.connectAddress}
		    			dataRevision={props.dataRevision}
					csvData={props.csvData}/>
				</div>
			);
	}
}

function DataView(props) {
	const [{ isDragging }, drag] = useDrag({
		item: { type: props.type },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	})
	return (
		<div className="DataView"
		ref={drag}
		style={{
			opacity: isDragging ? 0.5 : 1,
		}}
		>
		{props.name}
		</div>
	);
}

function GridOneAndTwo(props) {
	return (
		<div className="OneAndTwo">
			<DropView cls="one"
				selectedViews={props.selectedViews}
		    		finalDataset={props.finalDataset}
				csvData={props.csvData}
		    		selectedDataUpdater={props.selectedDataUpdater}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="two"
				selectedViews={props.selectedViews}
		    		finalDataset={props.finalDataset}
				csvData={props.csvData}
		    		selectedDataUpdater={props.selectedDataUpdater}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="three"
				selectedViews={props.selectedViews}
		    		finalDataset={props.finalDataset}
				csvData={props.csvData}
		    		selectedDataUpdater={props.selectedDataUpdater}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
		</div>
	);
}

function GridOneAndOneHorizontal(props) {
	return (
		<div className="OneAndOneHorizontal">
			<DropView cls="one"
				selectedViews={props.selectedViews}
		    		finalDataset={props.finalDataset}
				csvData={props.csvData}
		    		selectedDataUpdater={props.selectedDataUpdater}
				selectedData={props.selectedData}
		    		dataRevision={props.dataRevision}
				connectAddress={props.connectAddress}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="two"
				selectedViews={props.selectedViews}
		    		finalDataset={props.finalDataset}
				csvData={props.csvData}
		    		selectedDataUpdater={props.selectedDataUpdater}
				selectedData={props.selectedData}
		    		dataRevision={props.dataRevision}
				connectAddress={props.connectAddress}
				viewUpdater={props.viewUpdater}></DropView>
		</div>
	);
}

function GridOneAndOneVertical(props) {
	return (
		<div className="OneAndOneVertical">
			<DropView cls="one"
				selectedViews={props.selectedViews}
		    		finalDataset={props.finalDataset}
				csvData={props.csvData}
		    		selectedDataUpdater={props.selectedDataUpdater}
				selectedData={props.selectedData}
		    		dataRevision={props.dataRevision}
				connectAddress={props.connectAddress}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="two"
				selectedViews={props.selectedViews}
		    		finalDataset={props.finalDataset}
				csvData={props.csvData}
		    		selectedDataUpdater={props.selectedDataUpdater}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
		</div>
	);
}

function GridQuads(props) {
	return (
		<div className="Quads">
			<DropView cls="one"
				selectedViews={props.selectedViews}
		    		finalDataset={props.finalDataset}
				csvData={props.csvData}
		    		selectedDataUpdater={props.selectedDataUpdater}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="two"
				selectedViews={props.selectedViews}
		    		finalDataset={props.finalDataset}
				csvData={props.csvData}
		    		selectedDataUpdater={props.selectedDataUpdater}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="three"
				selectedViews={props.selectedViews}
		    		finalDataset={props.finalDataset}
				csvData={props.csvData}
		    		selectedDataUpdater={props.selectedDataUpdater}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="four"
				selectedViews={props.selectedViews}
		    		finalDataset={props.finalDataset}
				csvData={props.csvData}
		    		selectedDataUpdater={props.selectedDataUpdater}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
		</div>
	);
}

export default App;
