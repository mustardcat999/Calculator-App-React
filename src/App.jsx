import { useReducer } from 'react'
import './App.css'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete",
  EVALUATE: "evaluate"
}

function reducer(state, {type, payload}){
  switch(type){
    //ADDING DIGITS
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite==true){
        return {
          ...state,
          overwrite:false,
          currentOperand: `${""}${payload.digit}`
        }
      }
      if(payload.digit==="0"&&state.currentOperand==="0") return state;
      if(payload.digit==="."&&state.currentOperand.includes(".")) return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }


    //ALL CLEAR  
    case ACTIONS.CLEAR:
      return {}

    //CHOOSING OPERATIONS  
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand==null&&state.previousOperand==null) {
        return state
      }
      if(state.previousOperand==null){
        return {
          ...state, 
          operation: payload.operation,
          previousOperand: `${state.currentOperand}`,
          currentOperand: null
        }
      }
       
      if(state.currentOperand==null&&state.operation==payload.operation) {
        return  state
      }
      if(state.currentOperand==null&&state.operation!=null){
        return{
          ...state,
         operation: payload.operation,
        }

      }
        return{
            ...state,
           previousOperand: evaluate(state),
           operation: payload.operation,
           currentOperand: null
          }
      
      

    case ACTIONS.EVALUATE:
      let result=evaluate({...state})
      if(state.previousOperand==null){
        return state;
      }
      return {
        overwrite: true,
        currentOperand: result
      }

      case ACTIONS.DELETE_DIGIT:
        let newCurrent = state.currentOperand
        if(state.currentOperand==null){
          return {
            ...state,
            currentOperand: `${state.previousOperand}`,
            previousOperand: null,
            operation: null
          }
        }
        if(state.overwrite==true){
          newCurrent = `${state.currentOperand}`
          return{
            currentOperand: newCurrent.slice(0,-1)
          }
        }
        return{
          currentOperand: newCurrent.slice(0,-1)
        }        

  }
}

function evaluate({previousOperand, operation, currentOperand}){
  if(!isNaN(+previousOperand)||!isNaN(+currentOperand)){
  switch (operation) {
    case '+':
      return +previousOperand+ +currentOperand;
    case '-':
      return  +previousOperand- +currentOperand ;
    case '*':
      return   +previousOperand* +currentOperand ;
    case '/':
      return    Math.round((+previousOperand/ +currentOperand)*1e9)/1e9;
    case '^':
      return     Math.pow(+previousOperand , +currentOperand);
  }
}
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch]= useReducer(reducer,{});


  return (

    <div className="card">
        <div className='output'>
        <div className='previous-operand'>{previousOperand} {operation}</div>
        <div className='current-operand'>{currentOperand}</div>
        </div>
          <button  onClick={()=>dispatch({type: ACTIONS.CLEAR})}>AC</button>
          <button  onClick={()=>dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
          <OperationButton operation="^" dispatch={dispatch}/>
          <OperationButton operation="/" dispatch={dispatch}/>
          <DigitButton digit="7" dispatch={dispatch}/>
          <DigitButton digit="8" dispatch={dispatch}/>
          <DigitButton digit="9" dispatch={dispatch}/>
          <OperationButton operation="*" dispatch={dispatch}/>
          <DigitButton digit="4" dispatch={dispatch}/>
          <DigitButton digit="5" dispatch={dispatch}/>
          <DigitButton digit="6" dispatch={dispatch}/>
          <OperationButton operation="-" dispatch={dispatch}/>
          <DigitButton digit="1" dispatch={dispatch}/>
          <DigitButton digit="2" dispatch={dispatch}/>
          <DigitButton digit="3" dispatch={dispatch}/>
          <OperationButton operation="+" dispatch={dispatch}/>
          <DigitButton digit="." dispatch={dispatch}/>
          <DigitButton digit="0" dispatch={dispatch}/>
          <button className='span-two' onClick={()=>dispatch({type: ACTIONS.EVALUATE})}>=</button>
      </div>
  )
}

export default App
