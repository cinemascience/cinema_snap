import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
	  <ParallelCoordinateView />
	  <GridSelector />
	  <DataViewGrid />
	  <GridTemplateButton />
    </div>
  );
}

function ParallelCoordinateView() {
	return (
		<div className="ParallelCoordinate">
		ParallelCoordinate
		</div> 
	);
}

function GridSelector() {
	return (
		<div className="GridSelector">
		<DataView />
		<DataView />
		<DataView />
		<DataView />
		<DataView />
		<DataView />
		<DataView />
		<DataView />
		</div>
	);
}

function GridTemplateButton() {
	return (
		<div className="TemplateButton">
		TemplateButton
		</div>
	);
}

function DataViewGrid() {
	return (
		<div className="DataViewGrid">
		<GridQuads/>
		</div>
	);
}

function DataView() {
	return (
		<div className="DataView">
		DataView
		</div>
	);
}

function GridOneAndTwo() {
	return (
		<div className="OneAndTwo">
			<div className="one"></div>
			<div className="two"></div>
			<div className="three"></div>
		</div>
	);
}

function GridOneAndOneHorizontal() {
	return (
		<div className="OneAndOneHorizontal">
			<div className="one"></div>
			<div className="two"></div>
		</div>
	);
}

function GridOneAndOneVertical() {
	return (
		<div className="OneAndOneVertical">
			<div className="one"></div>
			<div className="two"></div>
		</div>
	);
}

function GridQuads() {
	return (
		<div className="Quads">
			<div className="one"></div>
			<div className="two"></div>
			<div className="three"></div>
			<div className="four"></div>
		</div>
	);
}

export default App;
