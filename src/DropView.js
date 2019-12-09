import React, {useState, useEffect} from 'react';
import { useDrop } from 'react-dnd'
import { dropped } from './DropLogic'
import ItemTypes from './ItemTypes'
import Papa from 'papaparse';
import Plot from 'react-plotly.js';
import './App.css';

function DropView(props){

	const [dataTraces, updateDataTraces] = useState([]);
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
			var xy_files = []
			var data_traces = []
			for (const line in props.csvData) {
				xy_files.push(props.csvData[line]["FILE_spectra_path"])
			}
			for (const file in xy_files){
				var path = xy_files[file]
				Papa.parse("http://" + props.connectAddress + "/" + path, {
					download: true,
					complete: function(results) {
						var x_array = []
						var y_array = []
						for (const line in results["data"]) {
							var point = results["data"][line][0]
							var components = point.split("  ");
							x_array.push(Number(components[0]));
							y_array.push(Number(components[1]));
						}
						var trace = {x: x_array, y: y_array, type: 'scatter'}
						data_traces.push(trace);
						updateDataTraces([...dataTraces, trace]);
					}
				});
			}

			
			return (

				<div
				ref={drop}
				style={{
					backgroundColor: isOver ? "green" : "cyan",
				}}
				className={props.cls}
				>
					<Plot
						data={dataTraces}
						layout={ {title: 'Intensity vs. Angle plot',
								autosize: true,
								datarevision: data_revision,
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4}		
						} }
						useResizeHandler={true}
						revision={data_revision}
						style={ {height:"100%",width:"100%"} }
					/>
				</div>
			);
			
		case "pvChart":
			var data_traces = []
			Papa.parse("http://" + props.connectAddress + "/" + props.csvData[0]["FILE_pressure_path"], {
				download: true,
				complete: function(results) {
					var x_array = []
					var y_array = []
					for (const line in results["data"]) {
						x_array.push(Number(results["data"][line][1]));
						y_array.push(Number(results["data"][line][2]));
					}
					var trace = {x: x_array, y: y_array, type: 'scatter'}
					data_traces.push(trace)
				}
			});
			data_revision++;
			
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
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4}		
						} }
						useResizeHandler={true}
						style={ {height:"100%",width:"100%"} }
					/>
				</div>
			);
		case "latticeVSTime":
			var data_traces = []
			Papa.parse("http://" + props.connectAddress + "/" + props.csvData[0]["FILE_lattice_path"], {
				download: true,
				complete: function(results) {
					var x_array = []
					var y_array = []
					for (const line in results["data"]) {
						x_array.push(Number(results["data"][line][1]));
						y_array.push(Number(results["data"][line][2]));
					}
					var trace = {x: x_array, y: y_array, type: 'scatter'}
					data_traces.push(trace)
				}
			});
			data_revision++;
			
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
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4}		
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
