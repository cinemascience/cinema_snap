import React, {useState, useEffect} from 'react';
import { useDrop } from 'react-dnd'
import { dropped } from './DropLogic'
import ItemTypes from './ItemTypes'
import Papa from 'papaparse';
import Plot from 'react-plotly.js';
import './App.css';

function DropView(props){

	const [dataRevision, updateDataRevision] = useState(0);
	const data_revision = 0;

	const [{ isOver }, drop] = useDrop({
		accept: [ItemTypes.PARALLELCOORD, 
			ItemTypes.XYGRAPH,
			ItemTypes.IMAGE,
			ItemTypes.PVCHART,
			ItemTypes.LATTICEVSTIME,
			ItemTypes.CONTOURDIAGRAM],
		drop: item => dropped(item, props.cls, props.viewUpdater, props.selectedViews),
		collect: monitor => ({
			isOver: !!monitor.isOver()
		}),
	})

	
			
	switch(props.selectedViews[props.cls]){
		case "image":
			return (
				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>
					<img src={"http://" + 
						props.connectAddress + 
						"/" + 
						props.csvData[props.selectedData]["FILE_image_path"]} 
					alt=""/>
					
				</div>
			);
		case "xyGraph":
			return (

				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>
					<Plot
						data={props.xyTraces}
						layout={ {title: 'Intensity vs. Angle plot',
								autosize: true,
								datarevision: props.dataRevision,
								uirevision: 1,
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: 'X-ray Diffraction Angle',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: 'Intensity',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    }
								  }
						} }
						useResizeHandler={true}
						revision="0"
						style={ {height:"100%",width:"100%"} }
					/>
				</div>
			);
			
		case "pvChart":
			
			console.log(data_traces);


			return (

				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>
					<Plot
						data={data_traces}
						layout={ {title: 'Pressure vs. Volume plot',
								autosize: true,
								datarevision: data_revision,
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: 'Pressure',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: 'Volume',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    }
								  }
						} }
						useResizeHandler={true}
						style={ {height:"100%",width:"100%"} }
					/>
				</div>
			);
		case "latticeVSTime":
			
			console.log(data_traces);


			return (

				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>
					<Plot
						data={data_traces}
						layout={ {title: 'Lattice vs. Time plot',
								autosize: true,
								datarevision: data_revision,
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: 'Time',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: 'Lattice Constant',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    }
								  }
						} }
						useResizeHandler={true}
						style={ {height:"100%",width:"100%"} }
					/>
				</div>
			);
		case "contourDiagram":
			var data_traces = []
			if(typeof props.csvData != "undefined"){
			Papa.parse("http://" + props.connectAddress + "/" + props.csvData[0]["FILE_heatmap_path"], {
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
					data_traces.push(trace)
				}
			});
			}
			
			console.log(data_traces);


			return (

				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>
					<Plot
						data={data_traces}
						layout={ {title: 'Contour Diagram',
								autosize: true,
								datarevision: data_revision,
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},
								  xaxis: {
								    title: {
								      text: 'X-ray Diffraction Angle',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: 'Shot number',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    }
								  }
						} }
						useResizeHandler={true}
						style={ {height:"100%",width:"100%"} }
					/>
				</div>
			);
		default:
			return (
				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>	
					{props.selectedViews[props.cls]}
				</div>
			);
	}
}


export default DropView;
