import { useRef, useState } from "react";

import AxiConnection from '../AxiConnection';
import AxiActions from '../AxiActions';

interface ControlProps {
  currentSvgData: object;
};

const AxiDrawControl = (props:ControlProps) => {
  const { currentSvgData } = props;

  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState();
  const selectRef = useRef(null);

  const registerConnection = (ws) => {
    setIsConnected(true);
    ws.send('get_name');
    setConnection(ws);
  };

  const handleDisconnected = () => {
    if (isConnected) {
      connection.close();
    }
    setIsConnected(false);
  }

  const handleConnectionError = (evt: Event) => {
    console.log("Websocket error:", evt);
  }

  function sendCommand(cmd: String) {
    if (cmd === "plot") {
      const pattern = /^(.*[\\/])/;
      const [root_url] = currentSvgData.raw_url.match(pattern);
      // console.log('root_url', root_url);
      const { filename } = currentSvgData;
      // console.log('filename', filename);
      connection.send(`${cmd}|${root_url}|${filename}`);
      // console.log("command is 'plot'");
    } else {
      // console.log(`command is ${cmd}`);
      connection.send(cmd);
    }
  }

  return (
    <section>
      <h3 className="mt0">AxiDraw</h3>
      <AxiConnection
        handleConnected={registerConnection}
        handleDisconnected={handleDisconnected}
        handleConnectionError={handleConnectionError}
        isConnected={isConnected}
      />
      {isConnected && <AxiActions sendCommand={sendCommand} />}
    </section>
  );
};

export default AxiDrawControl;
