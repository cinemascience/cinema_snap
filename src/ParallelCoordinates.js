import React from 'react';
import Plot from 'react-plotly.js';

{/* The Parallel Coordinate Chart */}
class ParallelCoordinates extends React.PureComponent {
	constructor(props){
		super(props);
	}

	render() {

                // dict that will hold arrays for each parameter
                var parameter_arrays = {}

                // loop over parameters
                for (const idx in this.props.parameter_columns){
                    var key = this.props.parameter_columns[idx]
                    parameter_arrays[key] = []

                    // add data to dict
                    for (const point in this.props.csvData){
                        parameter_arrays[key].push(this.props.csvData[point][key])
                    }
                }

                // set the trace
		var trace = {
			type: 'parcoords',
			line: {
				color: 'blue'
			},
                        dimensions: []
                };

                // add label and values for each parameter to trace
                for (const idx in this.props.parameter_columns){
                    var key = this.props.parameter_columns[idx]
                    trace["dimensions"].push({label: key,
                                              values: parameter_arrays[key]})
                }

		return (
			<div className="ParallelCoordinate">
				<Plot
					data={[trace]}
					layout={ {title: 'Parallel Coordinate Plot',
							autosize: true,
							uirevision: 1,
							selectionrevision: 1,
							margin: {l: 50, r: 50, b: 30, t: 80, pad: 4},
							y: 0
					} }
					useResizeHandler={true}
					style={ {height:"100%",width:"100%"} }
					onRestyle={(e) => this.props.selectionUpdater(e, trace)}
				/>
			</div> 
		);
	}
}

export default ParallelCoordinates;
