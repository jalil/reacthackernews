import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';


const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
 },
 {
   title: 'Redux',
   url: 'https://github.com/reactjs/redux',
   author: 'Dan Abramov, Andrew Clark',
   num_comments: 2,
   points: 5,
   objectID: 1,
  }, 
 ];

function isSearched(searchTerm){
    return function(item) {
       return !searchTerm || 
           item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
}

class App extends Component {
  constructor(props) {  
    super(props);

    this.state = {
        searchTerm: DEFAULT_QUERY,
        result: null,
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this); 
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

onDismiss(id) {
 function isNotId(item) {
     return item.objectID !==id; 
 } 

  const updatedHits = this.state.result.hits.filter(isNotId);
  this.setState({ 
       result: Object.assign({}, this.state.result, { hits: updatedHits })
  });
}

onSearchChange(event) {
    this.setState({ searchTerm: event.target.value});
}


setSearchTopstories(result) {
     this.setState({ result });
}

fetchSearchTopstories(searchTerm) {
       fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopstories(result));
}

componentDidMount() {
     const { searchTerm } = this.state;
     this.fetchSearchTopstories(searchTerm);
}
  render() {

    const { searchTerm, result } = this.state;

    if (!result) { return null;}
    return (
      <div className="App">
            <Search 
                value={searchTerm}
                onChange={this.onSearchChange}

            > 
              Search

              </Search>
              <div>
           { result
               ?  <Table
               list={result.hits}
               pattern={searchTerm}
               onDismiss={this.onDismiss}
               />
             : null
             }
            </div>
      </div>
    );
  }
}

function Search(props) {
    const { value,children, onChange} = props;
        return (
              <form >
              {children}
                <input 
                   type="text" 
                   value={value}
                   onChange={onChange}
                   />
              </form>
           );
  
}

function  Table(props)  {

    const { list, pattern, onDismiss } = props;
        return (
                <div>
        {list.filter(isSearched(pattern)).map((item) =>(
             <div key={item.objectID}>
                <span>
                <a href={item.url} >  {item.title} </a>
                </span>
                <span> {item.author} </span>
                <span> {item.num_comments} </span>
                <span> {item.points} </span>
                 <span>
                   <Button onClick={() => onDismiss(item.objectID)}>
                     Dismiss
                   </Button>
                 </span>
            </div>
        )) }
       </div> 
        );

}


function Button(props) {
       const { 
          onClick, 
          className='',
          children,
       } = props;

        return (
           <button 
                onClick={onClick}
                className={className}
                type="button"
               >
               {children}
               </button>

               );

}

export default App;



