import React from 'react';
import Plot from 'react-plotly.js';

{/* The Parallel Coordinate Chart */}
class ParallelCoordinates extends React.PureComponent {
	constructor(props){
		super(props);
	}
	render() {
		var shot = []
		var chi = []
		var chi_increment = []
		var count_cutoff = []
		var detector_distance = []
		var exposure_period = []
		var exposure_time = []
		var number_of_oscillations = []
		var phi = []
		var phi_increment = []
		var start_angle = []
		var tau = []
		var threshold_setting = []
		var wavelength = []
		for (const point in this.props.csvData){
			chi.push(this.props.csvData[point]["Chi"])
			chi_increment.push(this.props.csvData[point]["Chi increment"])
			count_cutoff.push(this.props.csvData[point]["Count cutoff"])
			detector_distance.push(this.props.csvData[point]["Detector Distance"])
			exposure_period.push(this.props.csvData[point]["Exposure period"])
			number_of_oscillations.push(this.props.csvData[point]["Number of Oscillations"])
			phi.push(this.props.csvData[point]["Phi"])
			phi_increment.push(this.props.csvData[point]["Phi increment"])
			start_angle.push(this.props.csvData[point]["Start Angle"])
			tau.push(this.props.csvData[point]["Tau"])
			threshold_setting.push(this.props.csvData[point]["Threshold setting"])
			wavelength.push(this.props.csvData[point]["Wavelength"])
		}


		var trace = {
			type: 'parcoords',
			line: {
				color: 'blue'
			},

			dimensions: [
			{
				label: "Chi",
				values: chi
			},
			{
				label: "Chi Increment",
				values: chi_increment
			},
			{
				label: "Detector Distance",
				values: detector_distance
			},
			{
				label: "Exposure Period",
				values: exposure_period
			},
			{
				label: "Number of Oscillations",
				values: number_of_oscillations
			},
			{
				label: "Phi",
				values: phi
			},
			{
				label: "Phi Increment",
				values: phi_increment
			},
			{
				label: "Tau",
				values: tau
			},
			{
				label: "Threshold",
				values: threshold_setting
			},
			{
				label: "Wavelength",
				values: wavelength
			},
			
			]
		};
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
