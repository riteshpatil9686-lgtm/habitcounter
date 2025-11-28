import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../lib/contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface Task {
  text: string;
  completed: boolean;
}

export function useContract() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.ethereum) {
      setError("MetaMask not detected");
      return;
    }

    const init = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const contract = getContract(signer);

        setProvider(provider);
        setSigner(signer);
        setAccount(address);
        setContract(contract);

        await loadTasks(contract);
      } catch (err: any) {
        setError(err.message);
      }
    };

    init();
  }, []);

  const loadTasks = async (contractInstance: any) => {
    try {
      setLoading(true);
      const count = await contractInstance.getTaskCount();
      const taskList: Task[] = [];

      for (let i = 0; i < Number(count); i++) {
        const task = await contractInstance.getTask(i);
        taskList.push({
          text: task[0],
          completed: task[1]
        });
      }

      setTasks(taskList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (text: string) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.addTask(text);
      await tx.wait();
      await loadTasks(contract);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (index: number) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.markCompleted(index);
      await tx.wait();
      await loadTasks(contract);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    account,
    tasks,
    loading,
    error,
    addTask,
    markCompleted
  };
}
