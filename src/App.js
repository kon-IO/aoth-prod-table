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
        <div className="min-h-[90%] my-4 flex flex-col gap-6 justify-center items-center">
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
        [frac(40), frac(50), frac(1), frac(1)],
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
    console.log(newArr);
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
      return (
        <React.Fragment key={ind}>
          <tr>
            <td>
              {ind + 913 < 930
                ? String.fromCharCode(ind + 913)
                : String.fromCharCode(ind + 914)}
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
              <RemoveRowButton removeCb={() => this.removeInd()} />
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
      <>
        <table className="table">
          <TabelHead />
          <tbody>{arr}</tbody>
        </table>
        <button
          type="button"
          className="plusButton"
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
      </>
    );
  }
}

function TabelHead() {
  return (
    <thead>
      <tr>
        <th>Συνδυασμοί</th>
        <th>Αγαθό Χ</th>
        <th>Αγαθό Υ</th>
        <th>ΚΕx</th>
        <th>ΚΕy</th>
        <th>Αφαίρεση</th>
      </tr>
    </thead>
  );
}

function EditableTd({ number, onBlur, ind, isX }) {
  return (
    <div
      contentEditable="true"
      onBlur={(e) => onBlur(ind, e, isX)}
      onKeyDown={(e) => {
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
