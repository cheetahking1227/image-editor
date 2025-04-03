import React from 'react';
import { AnnotationsTableDataProps } from '../types';

const AnnotationsTable: React.FC<AnnotationsTableDataProps> = ({ data, onObjectSelect }) => {
  return (
    <div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Type</th>
            <th>Text</th>
            <th>Coordinates</th>
            <th>Fill</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id || index} className="hover cursor-pointer" onClick={() => { onObjectSelect(item); }}>
              <td>{item.type}</td>
              <td>{item.text}</td>
              <td>{JSON.stringify(item.coordinates)}</td>
              <td>{item.fill}</td>
              <td>{item.stroke}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AnnotationsTable;
