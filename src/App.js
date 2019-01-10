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
  "ignore1",
  "ignore2",
  "sessionA",
  "sessionB",
];

const classroomForSessionA = [
  { name: "Chess (TK-5th) A", room: "B-25" },
  { name: "Yoga (TK-5th) A", room: "Room 5" },
  { name: "Circus Arts (TK-5th) A", room: "Kindergarten Playground" },
  { name: "Capoeira (3rd-5th) A", room: "Auditorium" },
  { name: "Soccer (3rd-5th) A", room: "Grass" },
  { name: "Coding (2nd-5th) A", room: "Room 2" },
  { name: "Ceramics (2nd-5th) A", room: "Ceramics" },
  { name: "Art (K-2nd) A", room: "Kindergarten Tables" },
  { name: "WOW LEGO® Early Engineering 1 (TK-2nd) A", room: "Room 1" },
  { name: "Gardening (K-5th) A", room: "Garden" },
  { name: "Flamenco (TK-5th) A", room: "B-21" },
  { name: "WOW LEGO® Elem. Engineering 2 (2nd-5th) A", room: "Room 7"},
  { name: "Tennis (K-1st) A", room: "Basketball Court"},
];

const classroomForSessionB = [
  { name: "Coding (2nd-5th) B", room: "Room 2" },
  { name: "Ceramics (TK-1) B", room: "Ceramics" },
  { name: "Chess (TK-5th) B", room: "B-25" },
  { name: "Soccer (TK-2nd) B", room: "Grass" },
  { name: "Tennis (2nd-5th) B", room: "Basketball Court" },
  { name: "WOW LEGO® Elem. Engineering 2 (2nd-5th) B", room: "Room 7" },
  { name: "Yoga (TK-5th) B", room: "Room 5" },
  { name: "Flamenco (TK-5th) B", room: "B-21" },
  { name: "Capoeira (K-2nd) B", room: "Auditorium" },
  { name: "WOW LEGO® Early Engineering 1 (TK-2nd) B", room: "Room 1" },
  { name: "Art (3rd-5th) B", room: "Kindergarten Tables" },
  { name: "Gardening (K-5th) B", room: "Garden" },
  { name: "Circus Arts (TK-5th) B", room: "Kindergarten Playground" },
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      columns: [],
      loadTable: false,
      fullData: [],
      dupes: [],
      invalidRows: [],
      afterSchoolPrograms: [],
      afterSchoolProgramsColumns: [],
      dataMapSessionA : {},
      dataMapSessionB: {},
    };
    this.loadTable = this.loadTable.bind(this);
    this.showAll = this.showAll.bind(this);
  }

  showAll() {
    this.setState({showAll: true});
  }

  loadTable(csvRows) {
    const fullData = [];
    let dataMapSessionA = classroomForSessionA.map(a => {
      return { name: a.name, data: []};
    });

    let dataMapSessionB = classroomForSessionB.map(b => {
      return { name: b.name, data: []};
    });

    let headers = csvRows[0].map((h, idx) => {
      return {'Header': h, 'accessor': accessors[idx] || h }
    });

    this.setState({columns: headers});

    let classesA = [];
    let classesB = [];
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

      if(!classesA.includes(tableRow.sessionA)) {
        classesA.push(tableRow.sessionA);
      }
      if(!classesB.includes(tableRow.sessionB)) {
        classesB.push(tableRow.sessionB);
      }
    }

    this.setState({fullData: fullData});
    this.setState({dataMapSessionA: dataMapSessionA});
    this.setState({dataMapSessionB: dataMapSessionB});

    ////////// Dupes
    // Find all where
    const names = {};


    const dupeNames = {};
    let dupeCount = 0;
    const dupes = [];
    const invalidRows = [];
    let invalidCount = 0;
    this.state.fullData.forEach(row => {
      if(!row.studentFirst || !row.studentLast) {
        invalidCount++;
        invalidRows.push(Object.assign({}, row));
        console.log('invalid');
        console.log(row);
      }
      else {
        let name = row.studentFirst.toLowerCase().trim() + ' ' + row.studentLast.toLowerCase().trim();
        if (names[name]) {
          dupeCount++;
          dupeNames[name] = 1;
        }
        else {
          names[name] = 1;
        }
      }
      if((row.sessionA == 'None' || row.sessionA == '' || row.sessionA == 'N/A') && (row.sessionB == 'None' || row.sessionB == '' || row.sessionB == 'N/A')) {
        invalidCount++;
        invalidRows.push(Object.assign({}, row));
        console.log('invalid');
        console.log(row);
      }
    });

    // Now that we know the dupes. add all dupes with that value (otherwise, we missed the first occurrence of a dupe, since it was not detected yet
    this.state.fullData.forEach(row => {
      if(row.studentFirst && row.studentLast) {
        let name = row.studentFirst.toLowerCase().trim() + ' ' + row.studentLast.toLowerCase().trim();
        if (dupeNames[name]) {
          dupes.push(Object.assign({}, row));
        }
      }
    });

    dupes.sort(this.sortStudents);
    invalidRows.sort(this.sortStudents);

    this.setState({dupeCount: dupeCount});
    this.setState({dupes: dupes});
    this.setState({invalidCount: invalidCount});
    this.setState({invalidRows: invalidRows});
    this.setState({loadTable: true});
  }

  sortStudents(a, b) {
    if(a.studentLast < b.studentLast) {
      return -1;
    }
    if(a.studentLast > b.studentLast) {
      return 1;
    }
    else {
      if(a.studentFirst < b.studentFirst) {
        return -1;
      }
      if(a.studentFirst > b.studentFirst) {
        return 1;
      }
      else {
        if(parseInt(a.id, 10) < parseInt(b.id, 10)) {
          return -1;
        }
        if(parseInt(a.id, 10) > parseInt(b.id, 10)) {
          return 1;
        }
      }
    }
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
          parserOptions={{skipEmptyLines: true}}
        />
        { this.state.loadTable &&
          <>
            <button onClick={this.showAll}>Show All</button>
            <h1>{this.state.dupeCount} Duplicates</h1>
            <CSVLink data={this.state.dupes}>Download Duplicates</CSVLink>
            <br/>
            <h1>Merged Master</h1>
            <CSVLink data={this.state.fullData}>Download Merged Master</CSVLink>
            <br/>
            <h1>Session A</h1>
          {this.state.dataMapSessionA.map((sessionA) => <><CSVLink
              data={sessionA.data}>Download {sessionA.name}</CSVLink> ({sessionA.data.length} enrolled)<br/></>
          )}
            <h1>Session B</h1>
          { this.state.dataMapSessionB.map((sessionB) =>
            <><CSVLink
              data={sessionB.data}>Download {sessionB.name}</CSVLink> ({sessionB.data.length} enrolled)<br/></>
          )}
            <br/>
          {this.state.showAll &&
           <>
           <h1>All</h1>
           < ReactTable
              filterable
              defaultPageSize={300}
              data={this.state.fullData}
              columns={this.state.columns}/></>
          }
          {this.state.invalidCount > 0 && <>
            <h1>{this.state.invalidCount} Invalid</h1>
            <ReactTable
              defaultPageSize={50}
              data={this.state.invalidRows}
              columns={this.state.columns}/>
          </>
          }
            <h1>{this.state.dupeCount} Duplicates</h1>
            <ReactTable
              defaultPageSize={50}
              data={this.state.dupes}
              columns={this.state.columns}/>

            <h1>Merged Master</h1>
            <ReactTable
              defaultPageSize={this.state.fullData.length}
              data={this.state.fullData}
              columns={afterSchoolProgramsColumns}/>

            <h1>Session A</h1>
            {
              this.state.dataMapSessionA.map((sessionA) =>
                                               <>
                                                 <h2>{sessionA.name} ({sessionA.data.length} enrolled)</h2>
                                                 <ReactTable
                                                   defaultPageSize={sessionA.data.length}
                                                   data={sessionA.data}
                                                   columns={afterSchoolProgramsColumns}/>
                                               </>
              )
            }
            <h1>Session B</h1>
            {
              this.state.dataMapSessionB.map((sessionB) =>
                                               <>
                                                 <h2>{sessionB.name} ({sessionB.data.length} enrolled)</h2>
                                                 <ReactTable
                                                   defaultPageSize={sessionB.data.length}
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
