import { Database, ID, account } from "@/appwrite";
import { Query } from "appwrite";
import { create } from "zustand";

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    getAccount: () => void;
    createUseOrLogin: (email: string, password: string, signUp: boolean, name?: string,) => void;
    logoutUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    setUser: (user: User) => set({ user: user }),
    getAccount: async () => {
        try {
            const user = await account.get();
            set({ user })
        } catch (err: any) {
            console.log(err.message)
        }
    },
    createUseOrLogin: async (email: string, password: string, signUp: boolean, name?: string) => {
        try {

            if (signUp) {
                await Database.createDocument(
                    process.env.NEXT_PUBLIC_DATABASE_ID!,
                    process.env.NEXT_PUBLIC_USER_COLLECTION_ID!,
                    ID.unique(),
                    {
                        name,
                        email,
                        password
                    }
                );
                await account.create(ID.unique(), email, password, name);
            }

            await account.createEmailSession(email, password);
            set({ user: await account.get() })
        } catch (err) {
            console.log(err);
        }
    },
    logoutUser: async () => {
        await account.deleteSession('current');
        set({ user: null })
    }
}))