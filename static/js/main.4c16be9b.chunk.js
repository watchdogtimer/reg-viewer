(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{16:function(e,a,t){e.exports=t(33)},22:function(e,a,t){},24:function(e,a,t){},33:function(e,a,t){"use strict";t.r(a);var n=t(1),s=t.n(n),r=t(9),o=t.n(r),i=(t(22),t(10)),l=t(11),m=t(14),c=t(12),d=t(15),u=t(3),h=(t(24),t(13)),p=t.n(h),g=t(4),A=(t(28),t(5)),E=["id","studentFirst","studentLast","grade","teacher","parentFirst","parentLast","parentEmail","parentPhone","alternateFirst","alternateLast","alternateEmail","alternatePhone","spanish","characterBuilders","primetime","none","ignore1","ignore2","sessionA","sessionB"],f=[{name:"Chess (TK-5th) A",room:"B-25"},{name:"Yoga (TK-5th) A",room:"Room 5"},{name:"Circus Arts (TK-5th) A",room:"Kindergarten Playground"},{name:"Capoeira (3rd-5th) A",room:"Auditorium"},{name:"Soccer (3rd-5th) A",room:"Grass"},{name:"Coding (2nd-5th) A",room:"Room 2"},{name:"Ceramics (2nd-5th) A",room:"Ceramics"},{name:"Art (K-2nd) A",room:"Kindergarten Tables"},{name:"WOW LEGO\xae Early Engineering 1 (TK-2nd) A",room:"Room 1"},{name:"Gardening (K-5th) A",room:"Garden"},{name:"Flamenco (TK-5th) A",room:"B-21"},{name:"WOW LEGO\xae Elem. Engineering 2 (2nd-5th) A",room:"Room 7"},{name:"Tennis (K-1st) A",room:"Basketball Court"}],B=[{name:"Coding (2nd-5th) B",room:"Room 2"},{name:"Ceramics (TK-1) B",room:"Ceramics"},{name:"Chess (TK-5th) B",room:"B-25"},{name:"Soccer (TK-2nd) B",room:"Grass"},{name:"Tennis (2nd-5th) B",room:"Basketball Court"},{name:"WOW LEGO\xae Elem. Engineering 2 (2nd-5th) B",room:"Room 7"},{name:"Yoga (TK-5th) B",room:"Room 5"},{name:"Flamenco (TK-5th) B",room:"B-21"},{name:"Capoeira (K-2nd) B",room:"Auditorium"},{name:"WOW LEGO\xae Early Engineering 1 (TK-2nd) B",room:"Room 1"},{name:"Art (3rd-5th) B",room:"Kindergarten Tables"},{name:"Gardening (K-5th) B",room:"Garden"},{name:"Circus Arts (TK-5th) B",room:"Kindergarten Playground"}],S=function(e){function a(){var e;return Object(i.a)(this,a),(e=Object(m.a)(this,Object(c.a)(a).call(this))).state={columns:[],loadTable:!1,fullData:[],dupes:[],invalidRows:[],afterSchoolPrograms:[],afterSchoolProgramsColumns:[],dataMapSessionA:{},dataMapSessionB:{}},e.loadTable=e.loadTable.bind(Object(u.a)(Object(u.a)(e))),e.showAll=e.showAll.bind(Object(u.a)(Object(u.a)(e))),e}return Object(d.a)(a,e),Object(l.a)(a,[{key:"showAll",value:function(){this.setState({showAll:!0})}},{key:"loadTable",value:function(e){var a=[],t=f.map(function(e){return{name:e.name,data:[]}}),n=B.map(function(e){return{name:e.name,data:[]}}),s=e[0].map(function(e,a){return{Header:e,accessor:E[a]||e}});this.setState({columns:s});for(var r=[],o=[],i=function(i){for(var l={},m=0;m<e[0].length;m++)l[s[m].accessor]=e[i][m];l.sessionAMerged="None"!=l.sessionA&&""!=l.sessionA?l.sessionA:l.spanish?l.spanish:l.characterBuilders?l.characterBuilders:l.primetime?l.primetime:l.none?l.none:"None",l.sessionBMerged="None"!=l.sessionB&&""!=l.sessionB?l.sessionB:l.characterBuilders?l.characterBuilders:l.primetime?l.primetime:l.none?l.none:"None",l.afterProgramming=l.characterBuilders?l.characterBuilders:l.primetime?l.primetime:l.none?l.none:"None";var c=f.find(function(e){return e.name===l.sessionA}),d=B.find(function(e){return e.name===l.sessionB});l.sessionAClassroom="None"!=l.sessionA&&""!=l.sessionA&&c?c.room:"N/A",l.sessionBClassroom="None"!=l.sessionB&&""!=l.sessionB&&d?d.room:"N/A",a.push(l);var u=t.find(function(e){return e.name===l.sessionA});u&&u.data.push(l);var h=n.find(function(e){return e.name===l.sessionB});h&&h.data.push(l),r.includes(l.sessionA)||r.push(l.sessionA),o.includes(l.sessionB)||o.push(l.sessionB)},l=1;l<e.length;l++)i(l);this.setState({fullData:a}),this.setState({dataMapSessionA:t}),this.setState({dataMapSessionB:n});var m={},c={},d=0,u=[],h=[],p=0;this.state.fullData.forEach(function(e){if(e.studentFirst&&e.studentLast){var a=e.studentFirst.toLowerCase().trim()+" "+e.studentLast.toLowerCase().trim();m[a]?(d++,c[a]=1):m[a]=1}else p++,h.push(Object.assign({},e)),console.log("invalid"),console.log(e);"None"!=e.sessionA&&""!=e.sessionA&&"N/A"!=e.sessionA||"None"!=e.sessionB&&""!=e.sessionB&&"N/A"!=e.sessionB||(p++,h.push(Object.assign({},e)),console.log("invalid"),console.log(e))}),this.state.fullData.forEach(function(e){if(e.studentFirst&&e.studentLast){var a=e.studentFirst.toLowerCase().trim()+" "+e.studentLast.toLowerCase().trim();c[a]&&u.push(Object.assign({},e))}}),u.sort(this.sortStudents),h.sort(this.sortStudents),this.setState({dupeCount:d}),this.setState({dupes:u}),this.setState({invalidCount:p}),this.setState({invalidRows:h}),this.setState({loadTable:!0})}},{key:"sortStudents",value:function(e,a){return e.studentLast<a.studentLast?-1:e.studentLast>a.studentLast?1:e.studentFirst<a.studentFirst?-1:e.studentFirst>a.studentFirst?1:parseInt(e.id,10)<parseInt(a.id,10)?-1:parseInt(e.id,10)>parseInt(a.id,10)?1:void 0}},{key:"showError",value:function(e){alert(e)}},{key:"render",value:function(){this.state.columns.map(function(e,a){return s.a.createElement("li",{key:e.Header+a},e.accessor)});var e=[{Header:"Student First Name",accessor:"studentFirst"},{Header:"Student Last Name",accessor:"studentLast"},{Header:"Grade",accessor:"grade"},{Header:"Teacher",accessor:"teacher"},{Header:"Parent First Name",accessor:"parentFirst"},{Header:"Parent Last Name",accessor:"parentLast"},{Header:"Parent Email",accessor:"parentEmail"},{Header:"Parent Phone",accessor:"parentPhone"},{Header:"Alternate First Name",accessor:"alternateFirst"},{Header:"Alternate Last Name",accessor:"alternateLast"},{Header:"Alternate Email",accessor:"alternateEmail"},{Header:"Alternate Phone",accessor:"alternatePhone"},{Header:"Spanish",accessor:"spanish"},{Header:"CB",accessor:"characterBuilders"},{Header:"PT",accessor:"primetime"},{Header:"A",accessor:"sessionA"},{Header:"B",accessor:"sessionB"},{Header:"A Merged",accessor:"sessionAMerged"},{Header:"B Merged",accessor:"sessionBMerged"},{Header:"A Classroom",accessor:"sessionAClassroom"},{Header:"B Classroom",accessor:"sessionBClassroom"},{Header:"After Programming",accessor:"afterProgramming"}];return s.a.createElement("div",{className:"App"},s.a.createElement(p.a,{cssClass:"csv-reader-input",label:"Select CSV",onFileLoaded:this.loadTable,onError:this.showError,parserOptions:{skipEmptyLines:!0}}),this.state.loadTable&&s.a.createElement(s.a.Fragment,null,s.a.createElement("button",{onClick:this.showAll},"Show All"),s.a.createElement("h1",null,this.state.dupeCount," Duplicates"),s.a.createElement(A.CSVLink,{data:this.state.dupes},"Download Duplicates"),s.a.createElement("br",null),s.a.createElement("h1",null,"Merged Master"),s.a.createElement(A.CSVLink,{data:this.state.fullData},"Download Merged Master"),s.a.createElement("br",null),s.a.createElement("h1",null,"Session A"),this.state.dataMapSessionA.map(function(e){return s.a.createElement(s.a.Fragment,null,s.a.createElement(A.CSVLink,{data:e.data},"Download ",e.name)," (",e.data.length," enrolled)",s.a.createElement("br",null))}),s.a.createElement("h1",null,"Session B"),this.state.dataMapSessionB.map(function(e){return s.a.createElement(s.a.Fragment,null,s.a.createElement(A.CSVLink,{data:e.data},"Download ",e.name)," (",e.data.length," enrolled)",s.a.createElement("br",null))}),s.a.createElement("br",null),this.state.showAll&&s.a.createElement(s.a.Fragment,null,s.a.createElement("h1",null,"All"),s.a.createElement(g.a,{filterable:!0,defaultPageSize:300,data:this.state.fullData,columns:this.state.columns})),this.state.invalidCount>0&&s.a.createElement(s.a.Fragment,null,s.a.createElement("h1",null,this.state.invalidCount," Invalid"),s.a.createElement(g.a,{defaultPageSize:50,data:this.state.invalidRows,columns:this.state.columns})),s.a.createElement("h1",null,this.state.dupeCount," Duplicates"),s.a.createElement(g.a,{defaultPageSize:50,data:this.state.dupes,columns:this.state.columns}),s.a.createElement("h1",null,"Merged Master"),s.a.createElement(g.a,{defaultPageSize:this.state.fullData.length,data:this.state.fullData,columns:e}),s.a.createElement("h1",null,"Session A"),this.state.dataMapSessionA.map(function(a){return s.a.createElement(s.a.Fragment,null,s.a.createElement("h2",null,a.name," (",a.data.length," enrolled)"),s.a.createElement(g.a,{defaultPageSize:a.data.length,data:a.data,columns:e}))}),s.a.createElement("h1",null,"Session B"),this.state.dataMapSessionB.map(function(a){return s.a.createElement(s.a.Fragment,null,s.a.createElement("h2",null,a.name," (",a.data.length," enrolled)"),s.a.createElement(g.a,{defaultPageSize:a.data.length,data:a.data,columns:e}))})))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(s.a.createElement(S,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[16,2,1]]]);
//# sourceMappingURL=main.4c16be9b.chunk.js.map