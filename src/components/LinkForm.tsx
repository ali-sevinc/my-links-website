import { app } from "@/firebase";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import Button from "./ui/Button";
import { serverTimestamp } from "firebase/database";
import InputGroup from "./ui/InputGroup";

type SessionType = {
  data: {
    user: {
      userId: string;
      email: string;
      image: string;
      name: string;
      username: string;
    };
  } | null;
};
type UserDataType = {
  profileImage: string;
  userId: string;
  username: string;
  docId: string;
};

type PropsType = { userData: UserDataType; onCloseForm: () => void };
export default function LinkForm({ userData, onCloseForm }: PropsType) {
  const [enteredUrl, setEnteredUrl] = useState("");
  const [enteredText, setEnteredText] = useState("");
  const [btnColor, setBtnColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");

  const [isLoading, setIsLoading] = useState(false);

  const { data } = useSession() as SessionType;
  const db = getFirestore(app);

  async function handleAddLink(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    if (!enteredUrl || !data || !userData || !enteredText) return;
    await addDoc(collection(db, "links", userData.docId, "link"), {
      enteredUrl,
      enteredText,
      textColor,
      btnColor,
      timestamp: serverTimestamp(),
    });
    setEnteredUrl("");
    setEnteredText("");
    setTextColor("#000000");
    setBtnColor("#ffffff");
    onCloseForm();
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleAddLink}
      className="bg-stone-100 flex flex-col gap-2 w-full max-w-xl mx-auto px-8 py-6"
    >
      <h2 className="text-center text-2xl font-semibold mb-4">Add Link</h2>
      <InputGroup
        id="url"
        label="Link URL"
        type="url"
        value={enteredUrl}
        onChange={setEnteredUrl}
      />
      <InputGroup
        id="text"
        label="Text"
        value={enteredText}
        onChange={setEnteredText}
      />
      <div className="flex items-center justify-center gap-8 my-4">
        <p className="flex items-center gap-1">
          <label htmlFor="button-color">Button Color</label>
          <input
            type="color"
            id="button-color"
            value={btnColor}
            onChange={(e) => setBtnColor(e.target.value)}
          />
        </p>
        <p className="flex items-center gap-1">
          <label htmlFor="text-color">Text Color</label>
          <input
            type="color"
            id="text-color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </p>
      </div>
      <div className="flex gap-4 items-center justify-center">
        <Button disabled={isLoading} type="submit">
          Add Link
        </Button>
      </div>
    </form>
  );
}
