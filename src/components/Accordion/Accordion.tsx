/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useId,
    useState,
    type ReactNode,
} from "react";


interface AccordionContextValue {
    openItem: string | null;
    toggleItem: (value: string) => void;
}

interface AccordionItemContextValue {
    value: string;
    isOpen: boolean;
    triggerId: string;
    contentId: string;
}


const AccordionContext = createContext<
    AccordionContextValue | undefined
>(undefined);

const AccordionItemContext = createContext<
    AccordionItemContextValue | undefined
>(undefined);

function useAccordionContext() {
    const context = useContext(AccordionContext);

    if (!context) {
        throw new Error(
            "Accordion components phải nằm trong Accordion"
        );
    }

    return context;
}

function useAccordionItemContext() {
    const context = useContext(AccordionItemContext);

    if (!context) {
        throw new Error(
            "Trigger và Content phải nằm trong Accordion.Item"
        );
    }

    return context;
}



interface AccordionRootProps {
    children: ReactNode;
    defaultValue?: string | null;
}

function AccordionRoot({
    children,
    defaultValue = null,
}: AccordionRootProps) {
    const [openItem, setOpenItem] = useState<
        string | null
    >(defaultValue);

    const toggleItem = (value: string) => {
        setOpenItem((current) =>
            current === value ? null : value
        );
    };

    return (
        <AccordionContext.Provider
            value={{
                openItem,
                toggleItem,
            }}
        >
            <div className="accordion">
                {children}
            </div>
        </AccordionContext.Provider>
    );
}



interface AccordionItemProps {
    value: string;
    children: ReactNode;
}

function AccordionItem({
    value,
    children,
}: AccordionItemProps) {
    const { openItem } = useAccordionContext();

    const id = useId();

    const isOpen = openItem === value;

    return (
        <AccordionItemContext.Provider
            value={{
                value,
                isOpen,
                triggerId: `${id}-trigger`,
                contentId: `${id}-content`,
            }}
        >
            <div className="accordion-item">
                {children}
            </div>
        </AccordionItemContext.Provider>
    );
}



interface AccordionTriggerProps {
    children: ReactNode;
}

function AccordionTrigger({
    children,
}: AccordionTriggerProps) {
    const { toggleItem } = useAccordionContext();

    const {
        value,
        isOpen,
        triggerId,
        contentId,
    } = useAccordionItemContext();

    return (
        <h2 className="accordion-heading">
            <button
                id={triggerId}
                type="button"
                className="accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleItem(value)}
            >
                <span>{children}</span>

                <span aria-hidden="true">
                    {isOpen ? "−" : "+"}
                </span>
            </button>
        </h2>
    );
}

interface AccordionContentProps {
    children: ReactNode;
}

function AccordionContent({
    children,
}: AccordionContentProps) {
    const {
        isOpen,
        triggerId,
        contentId,
    } = useAccordionItemContext();

    return (
        <div
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            className="accordion-content"
            hidden={!isOpen}
        >
            {children}
        </div>
    );
}

export const Accordion = Object.assign(
    AccordionRoot,
    {
        Item: AccordionItem,
        Trigger: AccordionTrigger,
        Content: AccordionContent,
    }
);