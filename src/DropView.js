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
                        ItemTypes.PCHART,
                        ItemTypes.PDOTCHART,
                        ItemTypes.PDOTDOTCHART,
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
						layout={ {title: 'Intensity vs Angle',
								autosize: true,
								datarevision: props.dataRevision,
								uirevision: 1,
								hovermode: 'closest',
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: '<b>2&#952; (deg.)</b>',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: '<b>Normalized Intensity</b>',
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
						layout={ {title: 'Pressure vs Frame',
								autosize: true,
								datarevision: data_revision,
								uirevision: 1, 
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: '<b>Frame</b>',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: '<b>Pressure</b>',
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

		case "pChart":
			if(typeof props.csvData === "undefined" || props.finalDataset.pTraces.length === 0){
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
						data={props.finalDataset.pTraces}
						layout={ {title: 'Pressure Fit vs Frame',
								autosize: true,
								datarevision: data_revision,
								uirevision: 1, 
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: '<b>Frame</b>',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: '<b>Pressure Fit</b>',
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
										x0: props.finalDataset.pTraces[0].x[props.selectedData],
										x1: props.finalDataset.pTraces[0].x[props.selectedData],
										y0: Math.min(...props.finalDataset.pTraces[0].y),
										y1: Math.max(...props.finalDataset.pTraces[0].y),
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

		case "pdotChart":
			if(typeof props.csvData === "undefined" || props.finalDataset.pdotTraces.length === 0){
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
						data={props.finalDataset.pdotTraces}
						layout={ {title: 'Pressure Fit 1st Derivative vs Frame',
								autosize: true,
								datarevision: data_revision,
								uirevision: 1, 
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: '<b>Frame</b>',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: '<b>Pressure Fit 1st Deriv.</b>',
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
										x0: props.finalDataset.pdotTraces[0].x[props.selectedData],
										x1: props.finalDataset.pdotTraces[0].x[props.selectedData],
										y0: Math.min(...props.finalDataset.pdotTraces[0].y),
										y1: Math.max(...props.finalDataset.pdotTraces[0].y),
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

		case "pdotdotChart":
			if(typeof props.csvData === "undefined" || props.finalDataset.pdotdotTraces.length === 0){
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
						data={props.finalDataset.pdotdotTraces}
						layout={ {title: 'Pressure Fit 2nd Derivative vs Frame',
								autosize: true,
								datarevision: data_revision,
								uirevision: 1, 
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: '<b>Frame</b>',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: '<b>Pressure Fit 2nd Deriv.</b>',
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
										x0: props.finalDataset.pdotdotTraces[0].x[props.selectedData],
										x1: props.finalDataset.pdotdotTraces[0].x[props.selectedData],
										y0: Math.min(...props.finalDataset.pdotdotTraces[0].y),
										y1: Math.max(...props.finalDataset.pdotdotTraces[0].y),
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
						layout={ {title: 'Lattice Constant vs Frame',
								autosize: true,
								datarevision: data_revision,
								uirevision: 1,
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},		
								  xaxis: {
								    title: {
								      text: '<b>Frame</b>',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: '<b>Lattice Constant</b>',
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
							{title: 'Intensity vs Frame Contour Diagram',
								autosize: true,
								datarevision: data_revision,
								uirevision: 1,
								margin: {l: 50, r: 50, b: 50, t: 70, pad: 4},
								  xaxis: {
								    title: {
								      text: '<b>2&#952; (deg.)</b>',
								      font: {
									family: 'Courier New, monospace',
									size: 18,
									color: '#7f7f7f'
								      }
								    },
								  },
								  yaxis: {
								    title: {
								      text: '<b>Frame</b>',
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
