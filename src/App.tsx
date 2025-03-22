import './App.css';
import { Table } from './components/Table';
import { tableData, columns } from './mockData/table.tsx';

function App() {
  return (
    <>
      <Table columns={columns} data={tableData} />
    </>
  );
}

export default App;
