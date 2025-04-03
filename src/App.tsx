import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import ImageEditor from './components/imageEditor';
import './components/imageEditor/components/fabricCustom/CustomLine';
import './components/imageEditor/components/fabricCustom/CustomFilters';
import './components/imageEditor/components/fabricCustom/CustomPolygon';
import './components/imageEditor/components/fabricCustom/CustomPolyLine';

function App() {
  return (
    <Provider store={store}>
      <ImageEditor />
    </Provider>
  );
}

export default App;
