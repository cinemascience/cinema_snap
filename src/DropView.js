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
			let img_width = 1600;
			let img_height = 1600;
			if(typeof props.csvData === "undefined" || props.finalDataset === "undefined"){
				return (
					<div
					ref={drop}
					style={{
						backgroundColor: isOver ? "green" : "cyan",
					}}
					className={props.cls}
					>	
						No database has been connected
					</div>
				);
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
						data={[
							{
								x: [0, img_width],
								y: [0, img_height],
								mode: "markers",
								marker_opacity:0,
							}
						]}
						layout={{
							autosize: true,
							images:[
							{
								"source": "http://" + 
								props.connectAddress + 
								"/" + 
								props.csvData[props.selectedData]["FILE_image_path"],
								
								xref:"x",
								yref:"y",
								x:0,
								y:img_height,
								sizex: img_width,
								sizey: img_height,
								layer: "below",
								sizing: "stretch",
							}	
							],
							xaxis: {
								visible: false,
							},
							yaxis: {
								visible: false,
								scaleanchor: "x",
							},
							margin: {"l":0, "r":0, "t":0, "b":0},
						}}
						useResizeHandler={true}
						style={ {height:"100%",width:"100%"} }
						config={{'doubleClick': 'reset'}}
						/>
				</div>
			);
		case "xyGraph":
			if(typeof props.csvData === "undefined" || props.finalDataset === "undefined"){
				return (
					<div
					ref={drop}
					style={{
						backgroundColor: isOver ? "green" : "cyan",
					}}
					className={props.cls}
					>	
						No database has been connected
					</div>
				);
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
						data={props.finalDataset.xyTraces}
						layout={ {title: 'Intensity vs. Angle plot',
								autosize: true,
								datarevision: props.dataRevision,
								uirevision: 1,
								hovermode: 'closest',
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
						config={{doubleClickDelay: 1000}}
						onClick={(e) => props.selectedDataUpdater(e.points[0].curveNumber)}
					/>
				</div>
			);
			
		case "pvChart":
			if(typeof props.csvData === "undefined" || props.finalDataset.pvTraces.length === 0){
				return (
					<div
					ref={drop}
					style={{
						backgroundColor: isOver ? "green" : "cyan",
					}}
					className={props.cls}
					>	
						No database has been connected
					</div>
				);
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
						data={props.finalDataset.pvTraces}
						layout={ {title: 'Pressure vs. Volume plot',
								autosize: true,
								datarevision: data_revision,
								uirevision: 1, 
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
								  },
								shapes: [
									{
										type: 'line',
										x0: props.finalDataset.pvTraces[0].x[props.selectedData],
										x1: props.finalDataset.pvTraces[0].x[props.selectedData],
										y0: Math.min(...props.finalDataset.pvTraces[0].y),
										y1: Math.max(...props.finalDataset.pvTraces[0].y),
										line: {
											color: 'rgb(0, 255, 0)',
											width: 4,
											dash: 'dot'
										}
									}
								]
						} }
						useResizeHandler={true}
						style={ {height:"100%",width:"100%"} }
						onClick={(e) => props.selectedDataUpdater(e.points[0].pointNumber)}
					/>
				</div>
			);
		case "latticeVSTime":
			if(typeof props.csvData === "undefined" || props.finalDataset.ltTraces.length === 0){
				return (
					<div
					ref={drop}
					style={{
						backgroundColor: isOver ? "green" : "cyan",
					}}
					className={props.cls}
					>	
						No database has been connected
					</div>
				);
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
						data={props.finalDataset.ltTraces}
						layout={ {title: 'Lattice vs. Time plot',
								autosize: true,
								datarevision: data_revision,
								uirevision: 1,
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
								  },
								shapes: [
									{
										type: 'line',
										x0: props.finalDataset.ltTraces[0].x[props.selectedData],
										x1: props.finalDataset.ltTraces[0].x[props.selectedData],
										y0: Math.min(...props.finalDataset.ltTraces[0].y),
										y1: Math.max(...props.finalDataset.ltTraces[0].y),
										line: {
											color: 'rgb(0, 255, 0)',
											width: 4,
											dash: 'dot'
										}
									}
								]
						} }
						useResizeHandler={true}
						style={ {height:"100%",width:"100%"} }
						onClick={(e) => props.selectedDataUpdater(e.points[0].pointNumber)}
					/>
				</div>
			);
		case "contourDiagram":
			if(typeof props.csvData === "undefined" || props.finalDataset.conTraces.length === 0){
				return (
					<div
					ref={drop}
					style={{
						backgroundColor: isOver ? "green" : "cyan",
					}}
					className={props.cls}
					>	
						No database has been connected
					</div>
				);
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
						data={props.finalDataset.conTraces}
						layout={ 
							{title: 'Contour Diagram',
								autosize: true,
								datarevision: data_revision,
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
								      text: 'Shot number',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    }
								  },
								shapes: [
									{
										type: 'line',
										x0: props.finalDataset.conTraces[0].x[0],
										x1: props.finalDataset.conTraces[0].x.slice(-1)[0],
										y0: props.selectedData,
										y1: props.selectedData,
										line: {
											color: 'rgb(0, 255, 0)',
											width: 4,
											dash: 'dot'
										}
									}
								]
						} }
						useResizeHandler={true}
						style={ {height:"100%",width:"100%"} }
						onClick={(e) => props.selectedDataUpdater(e.points[0].y)}
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
