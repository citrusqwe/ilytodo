import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import useOutsideClick from '../hooks/useOutsideClick';

type Option = {
  value: string;
  label: string;
};
type Props = {
  options: Option[];
  selectProps?: any;
  value?: string;
  error?: boolean;
  name: string;
};

const Select = ({ options, value, error, name, ...selectProps }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState('#000');
  const selectRef = useRef(null);
  useOutsideClick(selectRef, () => setOpen(false));
  const { register, formState } = useFormContext();

  useEffect(() => {
    const element = document.getElementById(name);
    if (element) {
      (element as HTMLInputElement).value = selected as string;
    }
  }, [selected]);

  return (
    <div className="z-[2000]">
      <select
        {...register(name, { required: true })}
        id={name}
        name={name}
        className=""
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <div
        ref={selectRef}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className="select-none relative z-[2000] w-full"
      >
        <div
          className={`pr-2 relative z-[2000] cursor-pointer bg-white text-gray-400 ${
            isOpen && 'open'
          }`}
        >
          <div className="relative z-[2000] flex items-center justify-between cursor-pointer border border-gray-300 rounded-md p-2">
            <span>
              {options.find((item) => item.value === selected)?.label ||
                'Select'}
            </span>
            <div className="relative z-[2000] h-2 w-3"></div>
          </div>
          {isOpen && (
            <AnimatePresence exitBeforeEnter>
              <motion.div
                variants={{
                  visible: { opacity: 1, transition: { duration: 0.1 } },
                  hidden: { opacity: 0, transition: { duration: 0.1 } },
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute rounded-md inlnie-block top-[100] left-0 right-0 bg-white transition duration-500 z-[2000] p-2 max-h-[200] overflow-y-auto"
              >
                {options.map((item) => (
                  <div
                    key={item.value}
                    onClick={() => setSelected(item.value)}
                    className="border px-2 py-1 mb-2 rounded-md border-gray-300 cursor-pointer group"
                  >
                    <span
                      className={`custom-option group-hover:bg-gray-theme selection:text-gray-theme selection:bg-gray-theme ${
                        selected === item.value && 'selected'
                      } `}
                      data-value={item.value}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Select;
