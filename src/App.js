import React from "react";
import "./App.css";
import {
  format,
  abs,
  fraction as frac,
  subtract as sub,
  add,
  divide as div,
} from "mathjs";

export default function App() {
  return (
    <main>
      <div class="h-screen">
        <div className="min-h-full w-full flex justify-center items-center">
          <Table />
        </div>
      </div>
    </main>
  );
}

function fmt(frc) {
  const formatted = format(frc);
  if (frc.d === 1) return frc.toString();
  return formatted;
}

// Table design from https://codepen.io/alico/pen/bpLgOL
class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        [frac(40), frac(50), frac(1, 3), frac(3)],
        [frac(10), frac(40)],
      ],
    };
  }

  removeInd(ind) {
    const arr = this.state.data.slice();
    arr.splice(ind, 1);
    this.setState({
      data: arr,
    });
  }

  findKE(y2, y1, x1, x2) {
    const KEx = abs(div(sub(y2, y1), sub(x2, x1)));
    const KEy = div(1, KEx);
    return [KEx, KEy];
  }

  calcKEs(nArr = null) {
    var prevX = null,
      prevY = null;
    let newArr;
    if (nArr === null) {
      newArr = this.state.data.slice();
    } else {
      newArr = nArr;
    }
    newArr.slice().forEach((el, ind) => {
      if (prevX === null) {
        prevX = el[0];
        prevY = el[1];
        return;
      }
      [newArr[ind - 1][2], newArr[ind - 1][3]] = this.findKE(
        el[1],
        prevY,
        el[0],
        prevX
      );
      prevX = el[0];
      prevY = el[1];
    });

    this.setState({
      data: newArr,
    });
  }

  addRow() {
    const arr = this.state.data.slice();
    if (arr.length === 0) {
      arr.push([frac(1), frac(1)]);
    } else {
      const firstLast = arr.length - 1;
      arr.push([add(arr[firstLast][0], 1), add(arr[firstLast][1], 1)]);
    }
    this.calcKEs(arr);
  }

  onEditableBlur(ind, event, isX) {
    const arr = this.state.data.slice();
    arr[ind][isX ? 0 : 1] = frac(event.target.innerText.replaceAll(/\s/g, ""));
    this.setState({
      data: arr,
    });
    this.calcKEs();
  }

  render() {
    const len = this.state.data.length;
    const arr = this.state.data.map((el, ind) => {
      let ch = ind % 24;
      ch = ch + 913 < 930 ? ch + 913 : ch + 914;
      return (
        <React.Fragment key={ind}>
          <tr>
            <td>
              {String.fromCharCode(ch)}
            </td>
            <td>
              <EditableTd
                onBlur={(i, e, x) => this.onEditableBlur(i, e, x)}
                number={fmt(el[0])}
                ind={ind}
                isX={true}
              />
            </td>
            <td>
              <EditableTd
                onBlur={(i, e, x) => this.onEditableBlur(i, e, x)}
                number={fmt(el[1])}
                ind={ind}
                isX={false}
              />
            </td>
            <td></td>
            <td></td>
            <td>
              <RemoveRowButton removeCb={() => this.removeInd(ind)} />
            </td>
          </tr>
          {ind === len - 1 ? (
            ""
          ) : (
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>{fmt(el[2])}</td>
              <td>{fmt(el[3])}</td>
              <td></td>
            </tr>
          )}
        </React.Fragment>
      );
    });

    return (
    <div className="my-8 flex flex-col gap-6 justify-center items-center w-full">
        <table className="table">
          <TabelHead />
          <tbody>{arr}</tbody>
        </table>
        <button
          type="button"
          className="plusButton mb-4"
          aria-label="Add row"
          onClick={() => this.addRow()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
              fill="white"
            ></path>
          </svg>
        </button>
      </div>
    );
  }
}

function TabelHead() {
  return (
    <thead>
      <tr>
        <th>????????????????????</th>
        <th>?????????? ??</th>
        <th>?????????? ??</th>
        <th>????x</th>
        <th>????y</th>
        <th>????????????????</th>
      </tr>
    </thead>
  );
}

// Thanks https://www.youtube.com/watch?v=cjIswDCKgu0
// function debounce(cb, delay = 2000) {
//   let timeout;

//   return (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       cb(...args);
//     }, delay);
//   };
// }

function EditableTd({ number, onBlur, ind, isX }) {
  // const debouncer = debounce((e) => {
  //   onBlur(ind, e, isX);
  // });
  return (
    <div
      contentEditable="true"
      onBlur={(e) => onBlur(ind, e, isX)}
      onKeyDown={(e) => {
        // debouncer(e);
        if (e.key === "Enter") {
          // Prevent newline from being typed
          e.preventDefault();
          // Make editable span lose focus
          e.target.blur();
        }
      }}
    >
      {number}
    </div>
  );
}

function RemoveRowButton({ removeCb }) {
  return (
    <button aria-label="Remove" onClick={() => removeCb()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
      </svg>
    </button>
  );
}
