import React from 'react';
import Papa from 'papaparse';

//I got this file reader from:
//https://stackoverflow.com/questions/44769051/how-to-upload-and-read-csv-files-in-react-js

class FileReader extends React.Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined
    };
    this.updateData = this.updateData.bind(this);
  }

  handleChange = event => {
    this.setState({
      csvfile: event.target.files[0]
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
  };

  updateData(result) {
    var data = result.data;
    console.log(data);
    this.props.dataUpdater(data);
  }

  render() {
    console.log(this.state.csvfile);
    return (
      <div className="FileReader">
        <input
          className="csv-input"
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleChange}
        />
        <button onClick={this.importCSV}> Upload </button>
      </div>
    );
  }
}

export default FileReader;
