import React from 'react';

class Header extends React.Component {
    render(){
        return ( 
          <nav className = "relative mx-auto bg-indigo-700 max-w-7xl py-4 px-4">
             <div class="container mx-auto">
                  <h1 class="text-white text-center text-3xl pb-4"> Movie Search </h1>
              </div>
          </nav>
    
        )
    }
}

export default Header