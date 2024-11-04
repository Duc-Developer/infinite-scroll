import InfiniteScroll from '@infinite-scroll/react';
import './App.css'
import '@infinite-scroll/react/styles';

const data = Array.from({ length: 100 }, (_, i) => i + 1)
function App() {

  return (
    <div className='app'>
      <h1>Demo for infinite scroll</h1>
      <InfiniteScroll height={200}>
       {data.map((item) => (
          <div key={item} className='item'>
            {item}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default App
