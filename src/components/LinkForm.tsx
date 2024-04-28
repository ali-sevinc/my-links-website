import { FormEvent, useState } from "react";

import { useSession } from "next-auth/react";
import { app } from "@/firebase";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { serverTimestamp } from "firebase/database";

import { SessionType } from "@/helpers/types";
import InputGroup from "./ui/InputGroup";
import Button from "./ui/Button";
import Heading from "./ui/Heading";

const urlRegex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/;

type UserDataType = {
  profileImage: string;
  userId: string;
  username: string;
  docId: string;
};

type PropsType = { userData: UserDataType; onCloseForm: () => void };
export default function LinkForm({ userData, onCloseForm }: PropsType) {
  const [enteredValues, setEnteredValues] = useState({
    enteredUrl: "",
    enteredText: "",
  });

  const [inputErrors, setInputErrors] = useState<{
    enteredUrl: string;
    enteredText: string;
  }>({ enteredText: "", enteredUrl: "" });

  const [btnColor, setBtnColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");

  const [isLoading, setIsLoading] = useState(false);

  const { data } = useSession() as SessionType;
  const db = getFirestore(app);

  async function handleAddLink(event: FormEvent) {
    event.preventDefault();

    const enteredUrl = enteredValues.enteredUrl;
    const enteredText = enteredValues.enteredText;

    if (!urlRegex.test(enteredUrl)) {
      setInputErrors((prev) => ({
        ...prev,
        enteredUrl: "Invalid URL. Please enter a valid URL",
      }));
    }
    if (!enteredText.trim().length) {
      setInputErrors((prev) => ({
        ...prev,
        enteredText: "Invalid link text. This line cannot be empty.",
      }));
    }

    if (
      !urlRegex.test(enteredUrl) ||
      !data ||
      !userData ||
      !enteredText.trim().length
    ) {
      return;
    }

    setIsLoading(true);
    await addDoc(collection(db, "links", userData.docId, "link"), {
      enteredUrl,
      enteredText,
      textColor,
      btnColor,
      timestamp: serverTimestamp(),
    });

    setTextColor("#000000");
    setBtnColor("#ffffff");
    onCloseForm();
    setIsLoading(false);
  }

  function handleChangeInput(value: string, name: string) {
    setEnteredValues((prev) => ({ ...prev, [name]: value }));
    setInputErrors((prev) => ({ ...prev, [name]: "" }));
  }

  return (
    <form
      onSubmit={handleAddLink}
      className="bg-stone-100 flex flex-col gap-2 w-full max-w-xl mx-auto px-2 md:px-8 py-6"
    >
      <div className="text-center mb-4">
        <Heading as="h2">Add Link</Heading>
      </div>

      <InputGroup
        id="url"
        label="Link URL"
        type="url"
        name="enteredUrl"
        value={enteredValues.enteredUrl}
        onChange={handleChangeInput}
        error={inputErrors.enteredUrl}
      />
      <InputGroup
        id="text"
        label="Text"
        name="enteredText"
        value={enteredValues.enteredText}
        onChange={handleChangeInput}
        error={inputErrors.enteredText}
      />
      <div className="flex items-center justify-center gap-2 flex-col my-4">
        <button
          type="button"
          style={{
            backgroundColor: btnColor,
            color: textColor,
          }}
          className="px-4 py-2 rounded font-semibold text-lg"
        >
          Test Link Button
        </button>
        <div className="flex flex-col md:flex-row gap-2">
          <p className="flex items-center gap-1 justify-between">
            <label htmlFor="button-color">Background</label>
            <input
              type="color"
              id="button-color"
              value={btnColor}
              onChange={(e) => setBtnColor(e.target.value)}
            />
          </p>
          <p className="flex items-center justify-between gap-1">
            <label htmlFor="text-color">Text</label>
            <input
              type="color"
              id="text-color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </p>
        </div>
      </div>
      <div className="flex gap-4 items-center justify-center">
        <Button disabled={isLoading} type="submit">
          Add Link
        </Button>
      </div>
    </form>
  );
}
