import Input from '../Input';


export default function Config() {
  
  
  return (
    <div id='config'>
      <div>
        <Input></Input>
        <Input></Input>
      </div>
      <div>
        <button onClick={handleNewSplitConfig}>Add New Split Config</button>
      </div>
    </div>
  )
}
