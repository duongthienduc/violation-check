import React from 'react';
import { render } from 'react-dom';
import { Throttle } from 'react-throttle';
import ReactGA from 'react-ga';
import {Table, Column, Cell} from 'fixed-data-table-2';
import axios from 'axios';
import shortid from 'shortid';

import '../public/assets/css/style.css';
import '../public/assets/css/fixed-data-table.css';

ReactGA.initialize('UA-4112584-7');
ReactGA.ga('send', 'pageview');

const MIN_BOARD_DIGITS_TO_SEARCH = 3;

const Title = ({ violationCount, updateTime }) => {
  return (
    <div>
      <div>
        <h1>Số vi phạm: {violationCount}</h1>
        <h2>Ngày cập nhật: {updateTime}</h2>
        <h2>Nguồn dữ liệu: <a
            href='https://www.facebook.com/groups/129222367470578'
            target='_blank'
          >
           Cảnh sát giao thông CATP Đà Nẵng
          </a>
        </h2>
      </div>
    </div>
  );
}

const Contact = () => {
  return (
    <div>
      <span>Liên hệ</span>
      <a href="mailto:namho1407@gmail.com">Nam Ho</a>
    </div>
  );
}

const ViolationTable = ({ violations, remove }) => {
  return (
    <Table
      rowHeight={50}
      rowsCount={violations.length}
      width={1400}
      height={600}
      headerHeight={50}
    >

      <Column
        header={<Cell>Ngày</Cell>}
        cell={({rowIndex, ...props}) => (
          <Cell {...props}>
            {violations[rowIndex].date}
          </Cell>
        )}
        width={100}
      />

      <Column
        header={<Cell>Giờ</Cell>}
        cell={({rowIndex, ...props}) => (
          <Cell {...props}>
            {violations[rowIndex].time}
          </Cell>
        )}
        width={100}
      />
      <Column
        header={<Cell>Biển số</Cell>}
        cell={({rowIndex, ...props}) => (
          <Cell {...props}>
            {violations[rowIndex].board}
          </Cell>
        )}
        width={130}
      />
      <Column
        header={<Cell>Lỗi Vi Phạm</Cell>}
        cell={({rowIndex, ...props}) => (
          <Cell {...props}>
            {violations[rowIndex].violation}
          </Cell>
        )}
        width={400}
      />
      <Column
        header={<Cell>Địa Điểm</Cell>}
        cell={({rowIndex, ...props}) => (
          <Cell {...props}>
            {violations[rowIndex].location}
          </Cell>
        )}
        width={600}
      />
    </Table>
  );
}

// Container Component

class ViolationCheckerApp extends React.Component {
  constructor(props) {
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: [],
      filterBoard: '',
      updateTime: '',
    }

    this.originalData = [];
    this.jsonUrl = '/resources/data.json?date=13092017';
  }
  // Lifecycle method
  componentDidMount() {
    // Make HTTP reques with Axios
    axios.get(this.jsonUrl)
      .then((res) => {
        this.originalData = res.data.items;

        // Set state with result
        this.setState({
          updateTime: res.data.date,
        });
      });
  }

  handleBoardFilter = (evt) => {
    var boardFilter = evt.target.value.trim().toLowerCase();
    var filteredData = [];

    if ('***' === boardFilter) {
      this.setState({
        data: [...this.originalData],
      });

      return;
    }

    if (boardFilter && boardFilter.length >= MIN_BOARD_DIGITS_TO_SEARCH) {
      filteredData = this.originalData.filter((item) => {
        var boardNo = item.board.toLowerCase();

        return boardNo.indexOf(boardFilter) > -1 ||
          boardNo.replace(/[-.]/g, '').indexOf(boardFilter) > -1;
      });
    }

    this.setState({
      data: filteredData,
    });
  };

  render() {
    return (
      <div>
        <Title violationCount={this.state.data.length} updateTime={this.state.updateTime} />

        <div className='filter-wrapper'>
          <span>Tìm biển số:</span>
          <Throttle time="500" handler="onChange">
            <input
              name='filterBoard' onChange={this.handleBoardFilter}
              placeholder='Nhập từ 3 chữ số trở lên để tìm kiếm'
            />
          </Throttle>
        </div>

        <div className='violations-wrapper'>
          <ViolationTable
            violations={this.state.data}
          />
        </div>

        <div className='contact-wrapper'>
          <Contact />
        </div>
      </div>
    );
  }
}

render(<ViolationCheckerApp />, document.getElementById('container'));
