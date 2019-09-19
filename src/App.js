import React, {Component} from 'react';
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
  {name: "Art (K-2nd) A", class: "Art", room: "Room 7"},
  {name: "Capoeira (3rd-5th) A", class: "Capoeira", room: "Auditorium"},
  {name: "Chess (2nd-5th) A", class: "Chess", room: "Room 14"},
  {name: "Circus Arts (TK-5th) A", class: "Circus Arts", room: "Kindergarten Playground"},
  {name: "Coding (2nd-5th) A", class: "Coding", room: "Room 15"},
  {name: "Flamenco (TK-5th) A", class: "Flamenco", room: "B-21"},
  {name: "Gardening (K-5th) A", class: "Gardening", room: "Garden"},
  {name: "LEGO® Early Engineering 1 (TK-2nd) A", class: "LEGO® Early Engineering 1", room: "Room 8"},
  {name: "Science Detectives (TK-5th)", class: "Science Detectives", room: "Room 2"},
  {name: "Soccer (3rd-5th) A", class: "Soccer", room: "Grass"},
  {name: "Yoga (TK-5th) A", class: "Yoga", room: "Room 3"},
];

const classroomForSessionB = [
  {name: "Art (3rd-5th) B", class: "Art", room: "Room 7"},
  {name: "Capoeira (K-2nd) B", class: "Capoeira", room: "Auditorium"},
  {name: "Chess (TK-5th) B", class: "Chess", room: "B-25"},
  {name: "Circus Arts (TK-5th) B", class: "Circus Arts", room: "Kindergarten Playground"},
  {name: "Coding (2nd-5th) B", class: "Coding", room: "Room 15"},
  {name: "Flamenco (TK-5th) B", class: "Flamenco", room: "B-21"},
  {name: "Gardening (K-5th) B", class: "Gardening", room: "Garden"},
  {name: "LEGO® Elem. Engineering 2 (2nd-5th) B", class: "LEGO® Elem. Engineering 2", room: "Room 8"},
  {name: "Science Detectives (TK-5th) B", class: "Science Detectives", room: "Room 2"},
  {name: "Soccer (TK-2nd) B", class: "Soccer", room: "Grass"},
  {name: "Yoga (TK-5th) B", class: "Yoga", room: "Room 3"},
];

let rawMasterCsv = [];
let duplicateCsv = [];

class App extends Component {
  constructor() {
    super();
    this.state = {
      columns: [],
      loadTable: false,
      masterArray: [],
      dupes: [],
      invalidRows: [],
      afterSchoolPrograms: [],
      afterSchoolProgramsColumns: [],
      dataMapSessionA: [],
      dataMapSessionB: [],
    };
    this.reloadTable = this.reloadTable.bind(this);
    this.showMaster = this.showMaster.bind(this);
    this.loadMasterCsv = this.loadMasterCsv.bind(this);
    this.loadDuplicateCsv = this.loadDuplicateCsv.bind(this);
  }

  showMaster() {
    this.setState({showMaster: true});
  }

  hideAll() {
    this.setState({showMaster: false});
  }

  showClasses() {
    this.setState({showClasses: true});
  }

  hideClasses() {
    this.setState({showClasses: false});
  }

  loadMasterCsv(csvRows) {
    rawMasterCsv = csvRows;
    this.reloadTable();
  }

  loadDuplicateCsv(csvRows) {
    duplicateCsv = csvRows;
    this.reloadTable();
  }

  computeStudentKey(entry) {
    return entry.studentFirst.toLowerCase().trim() + ' ' + entry.studentLast.toLowerCase().trim();
  }

  convertToObject(row, headers) {
    let tableRow = {};

    for (let csvCol = 0; csvCol < headers.length; csvCol++) {

      // set tableRow property
      // property name = header
      // property value = row value
      tableRow[headers[csvCol].accessor] = row[csvCol];
    }

    // Merging Rules for Concurrent After School Programming
    // Spanish is always session A
    // Primetime fills in session A or session B
    // Character Builders files in session A or session B
    // Primetime or Character Builders should be shown as after school programming IF session A and session B have
    // classes
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
    tableRow.classA = tableRow.sessionA != 'None' && tableRow.sessionA != '' && roomA ? roomA.class : 'N/A';
    tableRow.classB = tableRow.sessionB != 'None' && tableRow.sessionB != '' && roomB ? roomB.class : 'N/A';

    return tableRow;
  }

  reloadTable() {
    this.setState({loadMasterCsv: false});
    let masterArray = [];
    const duplicateArray = [];
    const duplicateCount = 0;
    let removedDuplicates = [];

    let headers = rawMasterCsv[0].map((h, idx) => {
      return {'Header': h, 'accessor': accessors[idx] || h}
    });

    this.setState({columns: [{
        Header: "",
        id: "row",
        maxWidth: 50,
        filterable: false,
        Cell: (row) => {
          return <div>{row.index + 1}</div>;
        },
      }].concat(headers)});

    for (let row = 1; row < rawMasterCsv.length; row++) {
      masterArray.push(this.convertToObject(rawMasterCsv[row], headers));
    }

    if (duplicateCsv.length > 0) {
      for (let row = 1; row < duplicateCsv.length; row++) {
        duplicateArray.push(this.convertToObject(duplicateCsv[row], headers));
      }
      // These should replace the entries which match the same first name and last name of student
      const duplicateMap = {};
      duplicateArray.forEach(row => {
        let name = this.computeStudentKey(row);
        duplicateMap[name] = row;
      });

      removedDuplicates = masterArray.filter(entry => duplicateMap[this.computeStudentKey(entry)]);
      masterArray = masterArray.filter(entry => !duplicateMap[this.computeStudentKey(entry)]);
      masterArray = masterArray.concat(duplicateArray);
    }


    let dataMapSessionA = classroomForSessionA.map(a => {
      return {name: a.name, class: a.class, data: []};
    });

    let dataMapSessionB = classroomForSessionB.map(b => {
      return {name: b.name, class: b.class, data: []};
    });

    let classesA = [];
    let classesB = [];

    masterArray.forEach(row => {
      // Push to class specific for sessionA and sessionB
      const dataMapSessionARowData = dataMapSessionA.find(c => c.name === row.sessionA);
      if (dataMapSessionARowData) {
        dataMapSessionARowData.data.push(row);
      }
      const dataMapSessionBRowData = dataMapSessionB.find(c => c.name === row.sessionB);
      if (dataMapSessionBRowData) {
        dataMapSessionBRowData.data.push(row);
      }

      if (!classesA.includes(row.sessionA)) {
        classesA.push(row.sessionA);
      }
      if (!classesB.includes(row.sessionB)) {
        classesB.push(row.sessionB);
      }
    });

    ////////// Dupes
    // Find all where
    const names = {};
    const dupeNames = {};
    let dupeCount = 0;
    const dupes = [];
    const invalidRows = [];
    let invalidCount = 0;
    masterArray.forEach(row => {
      if (!row.studentFirst || !row.studentLast) {
        invalidCount++;
        invalidRows.push(Object.assign({}, row));
      }
      else {
        let name = this.computeStudentKey(row);
        if (names[name]) {
          dupeCount++;
          dupeNames[name] = 1;
        }
        else {
          names[name] = 1;
        }
      }
      if (
        (
          (row.sessionAMerged === 'None' || row.sessionAMerged === '' || row.sessionAMerged === 'N/A') &&
          (row.sessionBMerged === 'None' || row.sessionBMerged === '' || row.sessionBMerged === 'N/A')
        )
        // ||
        // (
        //   (row.sessionAMerged === 'None' || row.sessionAMerged === '' || row.sessionAMerged === 'N/A') &&
        //   (row.sessionBMerged !== 'None' && row.sessionBMerged !== '' && row.sessionBMerged !== 'N/A')
        // )
      ) {
        invalidCount++;
        invalidRows.push(Object.assign({}, row));
      }
    });

    // Now that we know the dupes. add all dupes with that value (otherwise, we missed the first occurrence of a dupe,
    // since it was not detected yet
    masterArray.forEach(row => {
      if (row.studentFirst && row.studentLast) {
        let name = this.computeStudentKey(row);
        if (dupeNames[name]) {
          dupes.push(Object.assign({}, row));
        }
      }
    });

    dupes.sort(this.sortStudents);
    invalidRows.sort(this.sortStudents);
    removedDuplicates.sort(this.sortStudents);
    dataMapSessionA.forEach(obj => obj.data.sort(this.sortStudents));
    dataMapSessionB.forEach(obj => obj.data.sort(this.sortStudents));

    this.setState({masterArray: masterArray});
    this.setState({dataMapSessionA: dataMapSessionA});
    this.setState({dataMapSessionB: dataMapSessionB});
    this.setState({dupeCount: dupeCount});
    this.setState({dupes: dupes});
    this.setState({invalidCount: invalidCount});
    this.setState({invalidRows: invalidRows});
    this.setState({removedDuplicates: removedDuplicates});
    this.setState({loadMasterCsv: true});
  }

  sortStudents(a, b) {
    if (a.studentLast.toLowerCase().trim() < b.studentLast.toLowerCase().trim()) {
      return -1;
    }
    if (a.studentLast.toLowerCase().trim() > b.studentLast.toLowerCase().trim()) {
      return 1;
    }
    else {
      if (a.studentFirst.toLowerCase().trim() < b.studentFirst.toLowerCase().trim()) {
        return -1;
      }
      if (a.studentFirst.toLowerCase().trim() > b.studentFirst.toLowerCase().trim()) {
        return 1;
      }
      else {
        if (parseInt(a.id, 10) < parseInt(b.id, 10)) {
          return -1;
        }
        if (parseInt(a.id, 10) > parseInt(b.id, 10)) {
          return 1;
        }
      }
    }
  }

  showError(err) {
    alert(err);
  }

  render() {
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
      {'Header': 'Session A', 'accessor': 'sessionAMerged'},
      {'Header': 'A Classroom', 'accessor': 'sessionAClassroom'},
      {'Header': 'Session B', 'accessor': 'sessionBMerged'},
      {'Header': 'B Classroom', 'accessor': 'sessionBClassroom'},
      {'Header': 'After Programming', 'accessor': 'afterProgramming'},
    ];

    const afterColumns = [
      {'Header': 'Student First Name', 'accessor': 'studentFirst'},
      {'Header': 'Student Last Name', 'accessor': 'studentLast'},
      {'Header': 'Grade', 'accessor': 'grade'},
      {'Header': 'Teacher', 'accessor': 'teacher'},
      {'Header': 'Session A', 'accessor': 'sessionAMerged'},
      {'Header': 'A Classroom', 'accessor': 'sessionAClassroom'},
      {'Header': 'Session B', 'accessor': 'sessionBMerged'},
      {'Header': 'B Classroom', 'accessor': 'sessionBClassroom'},
      {'Header': 'After Programming', 'accessor': 'afterProgramming'},
    ];

    const paulineColumns = afterSchoolProgramsColumns.concat([
      {'Header': 'Volunteer Info', 'accessor': 'ignore1'},{'Header': 'Volunteer Info 2', 'accessor': 'ignore2'}]);

    afterSchoolProgramsColumns.forEach(col => {
      col.key = col.accessor;
      col.label = col.Header;
    });
    afterColumns.forEach(col => {
      col.key = col.accessor;
      col.label = col.Header;
    });
    paulineColumns.forEach(col => {
      col.key = col.accessor;
      col.label = col.Header;
    });
    const classArray = [];
    classroomForSessionA.forEach(classroom => {
      let sessionA = this.state.dataMapSessionA.find(session => session.class === classroom.class);
      let sessionB = this.state.dataMapSessionB.find(session => session.class === classroom.class);
      if (sessionA && sessionB) {
        classArray.push({
                          clazz: classroom.class,
                          data: sessionA.data.concat(sessionB.data)
                        });
      }
    });

    const characterBuildersArray = this.state.masterArray.filter(row => row.characterBuilders);
    characterBuildersArray.sort(this.sortStudents);

    const primetimeArray = this.state.masterArray.filter(row => row.primetime);
    primetimeArray.sort(this.sortStudents);

    const spanishArray = this.state.masterArray.filter(row => row.spanish);
    spanishArray.sort(this.sortStudents);

    return (
      <div className="App">
        <h1>Fall 2019 - 1:42PM</h1>
        <CSVReader
          cssClass="csv-reader-input"
          label="Upload Master CSV"
          onFileLoaded={this.loadMasterCsv}
          onError={this.showError}
          parserOptions={{skipEmptyLines: true}}
        />
        <CSVReader
          cssClass="csv-reader-input"
          label="Upload Duplicate Override CSV"
          onFileLoaded={this.loadDuplicateCsv}
          onError={this.showError}
          parserOptions={{skipEmptyLines: true}}
        />
        {this.state.loadMasterCsv &&
         <>
           <button onClick={this.showMaster}>Show All</button>
           <h1>{this.state.dupeCount} Duplicates</h1>
           <CSVLink data={this.state.dupes} filename='duplicates'>Download Duplicates</CSVLink>
           <br/>
           <h1>Merged Master</h1>
           <CSVLink data={this.state.masterArray} headers={afterSchoolProgramsColumns} filename='merged-master'>Download Merged Master</CSVLink>
           <br/>
           <h1>Pauline</h1>
           <CSVLink data={this.state.masterArray} headers={paulineColumns} filename='pauline-master'>Download Pauline's Master</CSVLink>
           <br/>
           <h1>Character Builders</h1>
           <CSVLink data={characterBuildersArray} headers={afterColumns} filename='character-builders'>Download Character Builders</CSVLink>
           <br/>
           <h1>Primetime</h1>
           <CSVLink data={primetimeArray} headers={afterColumns} filename='primetime'>Download Primetime</CSVLink>
           <br/>
           <h1>Spanish</h1>
           <CSVLink data={spanishArray} headers={afterColumns} filename='spanish'>Download Spanish</CSVLink>
           <br/>
           <h1>Classes</h1>
           {classArray.map((clazz) => <><CSVLink
             data={clazz.data} headers={afterSchoolProgramsColumns}
             filename={clazz.clazz.replace('.', '_')}>Download {clazz.clazz}</CSVLink><br/></>
           )}
           <h1>Session A</h1>
           {this.state.dataMapSessionA.map((sessionA) => <><CSVLink
             data={sessionA.data} headers={afterSchoolProgramsColumns}
             filename={sessionA.name.replace('.', '_')}>Download {sessionA.name}</CSVLink> ({sessionA.data.length} entries)<br/></>
           )}
           <h1>Session B</h1>
           {this.state.dataMapSessionB.map((sessionB) =>
                                             <><CSVLink
                                               data={sessionB.data} headers={afterSchoolProgramsColumns}
                                               filename={sessionB.name.replace('.', '_')}>Download {sessionB.name}</CSVLink> ({sessionB.data.length} entries)<br/></>
           )}
           <br/>
           {this.state.showMaster &&
            <>
              <h1>All</h1>
              < ReactTable
                filterable
                defaultPageSize={300}
                data={this.state.masterArray}
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
           {this.state.dupeCount > 0 && <>
             <h1>{this.state.dupeCount} Duplicates</h1>
             <ReactTable
               defaultPageSize={50}
               data={this.state.dupes}
               columns={this.state.columns}/>
           </>
           }
           {this.state.removedDuplicates.length > 0 && <>
             <h1>{this.state.removedDuplicates.length} Removed Duplicates</h1>
             <ReactTable
               defaultPageSize={50}
               data={this.state.removedDuplicates}
               columns={this.state.columns}/>
           </>
           }
           <h1>Merged Master</h1>
           <ReactTable
             filterable
             defaultPageSize={this.state.masterArray.length}
             data={this.state.masterArray}
             columns={afterSchoolProgramsColumns}/>

           <h1>Session A</h1>
           {
             this.state.dataMapSessionA.map((sessionA) =>
                                              <>
                                                <h2>{sessionA.name} ({sessionA.data.length} entries)</h2>
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
                                                <h2>{sessionB.name} ({sessionB.data.length} entries)</h2>
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
