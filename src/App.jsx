import { useCallback, useState } from 'react';
import './App.css';
import { Button, Table, Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const App = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [showConnectToast, setShowConnectToast] = useState(false);
  const [toastText, setToastText] = useState(false);
  const [toastType, setToastType] = useState('primary');

  const convertWeiToEth = useCallback((value) => {
    let wei = parseInt(value, 16);
    let convertedValue = wei / 10 ** 18;
    return convertedValue;
  }, []);

  const requestAccount = useCallback(async () => {
    if (walletAddress) return;
    if (window.ethereum) {
      try {
        const accounts = await window?.ethereum?.request({
          method: 'eth_requestAccounts',
        });

        const accountBalance = await window?.ethereum?.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });

        setToastText('Wallet successfully connected');
        setToastType('success');
        setShowConnectToast(true);
        setWalletAddress(accounts[0]);
        setBalance(convertWeiToEth(accountBalance));
      } catch (error) {
        setToastType('danger');
        setToastText('Error connecting...');
        setShowConnectToast(true);
      }
    } else {
      setToastType('warning');
      setToastText('No extension detected');
      setShowConnectToast(true);
    }
  }, [convertWeiToEth, walletAddress]);

  const disconnectWallet = useCallback(async () => {
    setToastText('Wallet successfully disconnected');
    setToastType('secondary');
    setShowConnectToast(true);
    setWalletAddress('');
    setBalance('');
  }, []);

  const Balance = useCallback(() => {
    if (balance === '') return;
    return (
      <Table striped bordered hover variant="light">
        <thead>
          <tr>
            <th>ETH Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{balance ? balance : 0}</td>
          </tr>
        </tbody>
      </Table>
    );
  }, [balance]);

  return (
    <>
      <Button
        variant={walletAddress ? 'success' : 'primary'}
        onClick={requestAccount}
      >
        {walletAddress ? walletAddress : 'Connect Wallet'}
      </Button>
      <Button
        variant={'danger'}
        onClick={disconnectWallet}
        hidden={!walletAddress}
      >
        X
      </Button>
      <Balance />
      <ToastContainer position="top-center">
        <Toast
          bg={toastType}
          onClose={() => setShowConnectToast(false)}
          show={showConnectToast}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastText}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default App;
