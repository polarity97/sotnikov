import autosize from "autosize";
import "./styles.scss";
import { CSSProperties, ChangeEvent, useEffect, useRef, useState } from "react";
import classNames from "classnames";

interface TextAreaProps {
    className?: string;
    children?: string;
    style?: CSSProperties;
    // defaultValue?: string;
    value?: string;
    onChange?: (val: string) => void;
}

const TextArea = ({ className, style, value, onChange }: TextAreaProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    // const [val, setVal] = useState<string>(value || "");

    const inputClassname = classNames({
        input: true,
        [`${className}`]: className,
    });

    useEffect(() => {
        textAreaRef.current && autosize(textAreaRef.current);
    }, [textAreaRef]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange && onChange(e.currentTarget.value);
    };
    return <textarea onChange={handleChange} style={style} ref={textAreaRef} className={inputClassname} defaultValue={value}></textarea>;
};

export default TextArea;
