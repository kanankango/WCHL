import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Types for frontend
export type Credential = {
  id: string;
  category: string;
  label: string;
  value: string;
};

export type UserProfile = {
  credentials: Credential[];
};

// Canister interface
const idlFactory = ({ IDL }: any) => {
  const Credential = IDL.Record({
    id: IDL.Text,
    category: IDL.Text,
    label: IDL.Text,
    value: IDL.Text,
  });
  const UserProfile = IDL.Record({
    credentials: IDL.Vec(Credential),
  });
  return IDL.Service({
    addCredential: IDL.Func([Credential], [IDL.Bool], []),
    editCredential: IDL.Func([Credential], [IDL.Bool], []),
    deleteCredential: IDL.Func([IDL.Text], [IDL.Bool], []),
    getMyProfile: IDL.Func([], [UserProfile], ['query']),
    getAutofillTemplate: IDL.Func([IDL.Text], [IDL.Vec(Credential)], ['query']),
    greet: IDL.Func([IDL.Text], [IDL.Text], ['query']),
  });
};

class ICPService {
  private actor: any;
  private agent: HttpAgent;

  constructor() {
    this.agent = new HttpAgent({
      host: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:4943' 
        : 'https://mainnet.dfinity.network'
    });
    if (process.env.NODE_ENV === 'development') {
      this.agent.fetchRootKey().catch(err => {
        console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
      });
    }
    const canisterId = process.env.NODE_ENV === 'development' 
      ? 'rdmx6-jaaaa-aaaaa-aaadq-cai' 
      : 'your-mainnet-canister-id';
    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId,
    });
  }

  async addCredential(cred: Credential): Promise<boolean> {
    try {
      return await this.actor.addCredential(cred);
    } catch (error) {
      console.error('Error adding credential:', error);
      return false;
    }
  }

  async editCredential(cred: Credential): Promise<boolean> {
    try {
      return await this.actor.editCredential(cred);
    } catch (error) {
      console.error('Error editing credential:', error);
      return false;
    }
  }

  async deleteCredential(id: string): Promise<boolean> {
    try {
      return await this.actor.deleteCredential(id);
    } catch (error) {
      console.error('Error deleting credential:', error);
      return false;
    }
  }

  async getMyProfile(): Promise<UserProfile> {
    try {
      return await this.actor.getMyProfile();
    } catch (error) {
      console.error('Error getting profile:', error);
      return { credentials: [] };
    }
  }

  async getAutofillTemplate(formType: string): Promise<Credential[]> {
    try {
      return await this.actor.getAutofillTemplate(formType);
    } catch (error) {
      console.error('Error getting autofill template:', error);
      return [];
    }
  }

  async greet(name: string): Promise<string> {
    try {
      return await this.actor.greet(name);
    } catch (error) {
      return 'Hello!';
    }
  }
}

export const icpService = new ICPService();