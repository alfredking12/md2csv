import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import { Button, Input, Layout, Row, Col } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

var showdown  = require('showdown'),
    converter = new showdown.Converter();
var md = require( "markdown" ).markdown;

var style = {
  fontSize: 18,
  width: '100%',
  textAlign: 'center'
};

var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      md: '',
      html: '',
      csv: ''
    };
  }

  render() {
    return (
      <Layout>
        <Layout>
          <Content>
            <Row>
              <Col span={8}><div style={style}>Markdown</div><Input onChange={this.changeMarkdown.bind(this)} value={this.state.md} type="textarea" placeholder="请输入Markdown表格" rows={60} /></Col>
              <Col span={8}><div style={style}>Preview</div><div ref='div' style={{height: 1090, overflow:'hidden', overflowY:'auto'}} dangerouslySetInnerHTML={{__html: this.state.html}}></div></Col>
              <Col span={8}><div style={style}>CSV</div><Input value={this.state.csv} type="textarea" disabled={true} rows={60} /></Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }

  changeMarkdown(e) {
    var me = this;
    this.setState({
      md: e.target.value,
      html: marked(e.target.value)
    }, function() {
      me.md2csv();
    })
  }

  md2csv() {
    var dom, csv = '', i = 0, tables = [], item = null;
    
    dom = ReactDOM.findDOMNode(this.refs.div);
    
    for (i=0; i<dom.children.length; i++) {
      item = dom.children[i];
      if (item.nodeName === 'TABLE') {
        tables.push(item);
      }
    }
    
    for (i=0; i<tables.length;i++) {
      csv += this.generateCSV(tables[i]) + '\n';
    }

    this.setState({
      csv: csv
    });

    this.saveFile('xx.csv', csv);
  }

  generateCSV(table) {
    var csv = '', i = 0, j = 0; 
    var rows = table.rows;
    for (i=0; i<rows.length;i++) {
      var row = rows[i];
      var cells = row.cells;
      for (j=0; j<cells.length;j++) {
        csv += cells[j].innerText.replace(/\n| /g, '').replace(/,/g, '，');
        if (j != cells.length - 1) csv += ',';
      }
      csv += '\n';
    }
    return csv;
  }

  saveFile(filename, content) {
    var w = window.open("", "生成", "height=0,width=0,toolbar=no,menubar=no,scrollbars=no,resizable=on,location=no,status=no");
    w.document.write(content);
    w.document.execCommand("SaveAs", true, filename);
    w.close();
  }
}

export default App;
