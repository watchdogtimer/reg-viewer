import React, { Component } from 'react';
import './App.css';
import CSVReader from 'react-csv-reader';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {CSVLink} from 'react-csv';

const accessors = [
  "id",
  "studentFirst",
  "studentLast",
  "grade",
  "teacher",
  "parentFirst",
  "parentLast",
  "parentEmail",
  "parentPhone",
  "alternateFirst",
  "alternateLast",
  "alternateEmail",
  "alternatePhone",
  "spanish",
  "characterBuilders",
  "primetime",
  "none",
  "other",
  "ignore1",
  "ignore2",
  "sessionA",
  "sessionB",
];

const classroomForSessionA = [
  { name: "Chess (TK-5th) A", room: "room1" },
  { name: "Coding (2nd-5th)", room: "room2" },
  { name: "Capoeira (K-2nd) A", room: "room3" },
  { name: "Circus Arts (TK-5th) A", room: "room4" },
  { name: "Ceramics (TK-1st) A", room: "room5" },
  { name: "Flamenco (TK-5th) A", room: "room6" },
  { name: "Gardening (K-5th) A", room: "room7" },
  { name: "Soccer (TK-2nd)", room: "room8" },
  { name: "WOW LEGO® Early Engineering 1 (TK-2nd) A", room: "room9" },
  { name: "WOW LEGO® Elem. Engineering 2 (2nd-5th) A", room: "room10" },
  { name: "Yoga (TK-5th) A", room: "room11" },
];

const classroomForSessionB = [
  { name: "Capoeira (3rd-5th) B", room: "room1" },
  { name: "Ceramics (2nd-5th) B", room: "room2" },
  { name: "Chess (TK-5th) B", room: "room3" },
  { name: "Circus Arts (TK-5th) B", room: "room4" },
  { name: "Coding (2nd-5th) B", room: "room5" },
  { name: "Flamenco (TK-5th) B", room: "room6" },
  { name: "Gardening (K-5th) B", room: "room7" },
  { name: "Soccer (3rd-5th) B", room: "room8" },
  { name: "WOW LEGO® Early Engineering 1 (TK-2nd) B", room: "room9" },
  { name: "WOW LEGO® Elem. Engineering 2 (2nd-5th) B", room: "room10" },
  { name: "Yoga (TK-5th) B", room: "room11" },
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      columns: [],
      loadTable: false,
      fullData: [],
      dupes: [],
      afterSchoolPrograms: [],
      afterSchoolProgramsColumns: [],
      dataMapSessionA : {},
      dataMapSessionB: {},
    };
    this.loadTable = this.loadTable.bind(this);
  }

  loadTable(csvRows) {
    const fullData = [];
    let dataMapSessionA = [
      { name: "Chess (TK-5th) A", data: [] },
      { name: "Coding (2nd-5th)", data: [] },
      { name: "Capoeira (K-2nd) A", data: [] },
      { name: "Circus Arts (TK-5th) A", data: [] },
      { name: "Ceramics (TK-1st) A", data: [] },
      { name: "Flamenco (TK-5th) A", data: [] },
      { name: "Gardening (K-5th) A", data: [] },
      { name: "Soccer (TK-2nd)", data: [] },
      { name: "WOW LEGO® Early Engineering 1 (TK-2nd) A", data: [] },
      { name: "WOW LEGO® Elem. Engineering 2 (2nd-5th) A", data: [] },
      { name: "Yoga (TK-5th) A", data: [] },
    ];
    let dataMapSessionB = [
      { name: "Capoeira (3rd-5th) B", data: [] },
      { name: "Ceramics (2nd-5th) B", data: [] },
      { name: "Chess (TK-5th) B", data: [] },
      { name: "Circus Arts (TK-5th) B", data: [] },
      { name: "Coding (2nd-5th) B", data: [] },
      { name: "Flamenco (TK-5th) B", data: [] },
      { name: "Gardening (K-5th) B", data: [] },
      { name: "Soccer (3rd-5th) B", data: [] },
      { name: "WOW LEGO® Early Engineering 1 (TK-2nd) B", data: [] },
      { name: "WOW LEGO® Elem. Engineering 2 (2nd-5th) B", data: [] },
      { name: "Yoga (TK-5th) B", data: [] },
    ];

    let headers = csvRows[0].map((h, idx) => {
      return {'Header': h, 'accessor': accessors[idx] || h }
    });

    this.setState({columns: headers});

    for(let row = 1; row < csvRows.length; row++) {
      let tableRow = {};


      for(let csvCol = 0; csvCol < csvRows[0].length; csvCol++) {
        // set tableRow property
        // property name = header
        // property value = row value
        tableRow[headers[csvCol].accessor] = csvRows[row][csvCol];
      }

      // Merging Rules for Concurrent After School Programming
      // Spanish is always session A
      // Primetime fills in session A or session B
      // Character Builders files in session A or session B
      // Primetime or Character Builders should be shown as after school programming IF session A and session B have classes
      tableRow.sessionAMerged = tableRow.sessionA != 'None' && tableRow.sessionA != ''
                                ? tableRow.sessionA
                                : tableRow.spanish
                                  ? tableRow.spanish
                                  : tableRow.characterBuilders
                                    ? tableRow.characterBuilders
                                    : tableRow.primetime
                                      ? tableRow.primetime
                                      : tableRow.none ? tableRow.none : 'None';
      tableRow.sessionBMerged = tableRow.sessionB != 'None' && tableRow.sessionB != ''
                                ? tableRow.sessionB
                                : tableRow.characterBuilders
                                  ? tableRow.characterBuilders
                                  : tableRow.primetime
                                    ? tableRow.primetime
                                    : tableRow.none ? tableRow.none : 'None';

      tableRow.afterProgramming = tableRow.characterBuilders
                                  ? tableRow.characterBuilders
                                  : tableRow.primetime
                                    ? tableRow.primetime
                                    : tableRow.none ? tableRow.none : 'None';

      const roomA = classroomForSessionA.find(c => c.name === tableRow.sessionA);
      const roomB = classroomForSessionB.find(c => c.name === tableRow.sessionB);
      tableRow.sessionAClassroom = tableRow.sessionA != 'None' && tableRow.sessionA != '' && roomA ? roomA.room : 'N/A';
      tableRow.sessionBClassroom = tableRow.sessionB != 'None' && tableRow.sessionB != '' && roomB ? roomB.room : 'N/A';

      fullData.push(tableRow);

      // Push to class specific for sessionA and sessionB
      const dataMapSessionARowData = dataMapSessionA.find(c => c.name === tableRow.sessionA);
      if(dataMapSessionARowData) {
        dataMapSessionARowData.data.push(tableRow);
      }
      const dataMapSessionBRowData = dataMapSessionB.find(c => c.name === tableRow.sessionB);
      if(dataMapSessionBRowData) {
        dataMapSessionBRowData.data.push(tableRow);
      }
    }

    this.setState({fullData: fullData});
    this.setState({dataMapSessionA: dataMapSessionA});
    this.setState({dataMapSessionB: dataMapSessionB});
    this.setState({loadTable: true});

    ////////// Dupes
    // Find all where
    const firstName = 'studentFirst';
    const lastName = 'studentLast';
    const names = {};


    const dupes = [];
    this.state.fullData.forEach(row => {
      let name = row[firstName] + ' ' + row[lastName];
      if(names[name]) {
        dupes.push(Object.assign({}, row));
      }
      else {
        names[name] = 1;
      }
    });
    this.setState({dupes: dupes});
  }

  showError(err) {
    alert(err);
  }

  render() {
    const headers = this.state.columns.map((col, idx) => {
      return <li key={col.Header + idx}>{col.accessor}</li>
    });

    const afterSchoolProgramsColumns = [
      {'Header': 'Student First Name', 'accessor': 'studentFirst'},
      {'Header': 'Student Last Name', 'accessor': 'studentLast'},
      {'Header': 'Grade', 'accessor': 'grade'},
      {'Header': 'Teacher', 'accessor': 'teacher'},
      {'Header': 'Parent First Name', 'accessor': 'parentFirst'},
      {'Header': 'Parent Last Name', 'accessor': 'parentLast'},
      {'Header': 'Parent Email', 'accessor': 'parentEmail'},
      {'Header': 'Parent Phone', 'accessor': 'parentPhone'},
      {'Header': 'Alternate First Name', 'accessor': 'alternateFirst'},
      {'Header': 'Alternate Last Name', 'accessor': 'alternateLast'},
      {'Header': 'Alternate Email', 'accessor': 'alternateEmail'},
      {'Header': 'Alternate Phone', 'accessor': 'alternatePhone'},
      {'Header': 'Spanish', 'accessor': 'spanish'},
      {'Header': 'CB', 'accessor': 'characterBuilders'},
      {'Header': 'PT', 'accessor': 'primetime'},
      {'Header': 'A', 'accessor': 'sessionA'},
      {'Header': 'B', 'accessor': 'sessionB'},
      {'Header': 'A Merged', 'accessor': 'sessionAMerged'},
      {'Header': 'B Merged', 'accessor': 'sessionBMerged'},
      {'Header': 'A Classroom', 'accessor': 'sessionAClassroom'},
      {'Header': 'B Classroom', 'accessor': 'sessionBClassroom'},
      {'Header': 'After Programming', 'accessor': 'afterProgramming'},
    ];

    return (
      <div className="App">
        <CSVReader
          cssClass="csv-reader-input"
          label="Select CSV"
          onFileLoaded={this.loadTable}
          onError={this.showError}
        />
        { this.state.loadTable &&
          <>
            <h1>Session A</h1>
          {this.state.dataMapSessionA.map((sessionA) => <><CSVLink
              data={sessionA.data}>Download {sessionA.name}</CSVLink><br/></>
          )}
            <h1>Session B</h1>
          { this.state.dataMapSessionB.map((sessionB) =>
            <><CSVLink
              data={sessionB.data}>Download {sessionB.name}</CSVLink><br/></>
          )}
            <br/>
            <h1>All</h1>
            <ReactTable
              defaultPageSize={300}
              data={this.state.fullData}
              columns={this.state.columns}/>

            <h1>Duplicates</h1>
            <ReactTable
              data={this.state.dupes}
              columns={this.state.columns}/>

            <h1>After School Programs</h1>
            <ReactTable
              defaultPageSize={300}
              data={this.state.fullData}
              columns={afterSchoolProgramsColumns}/>

            <h1>Session A</h1>
            {
              this.state.dataMapSessionA.map((sessionA) =>
                                               <>
                                                 <h2>{sessionA.name}</h2>
                                                 <ReactTable
                                                   defaultPageSize={25}
                                                   data={sessionA.data}
                                                   columns={afterSchoolProgramsColumns}/>
                                               </>
              )
            }
            <h1>Session B</h1>
            {
              this.state.dataMapSessionB.map((sessionB) =>
                                               <>
                                                 <h2>{sessionB.name}</h2>
                                                 <ReactTable
                                                   defaultPageSize={25}
                                                   data={sessionB.data}
                                                   columns={afterSchoolProgramsColumns}/>
                                               </>
              )
            }
          </>
        }
      </div>
    );
  }
}

export default App;
