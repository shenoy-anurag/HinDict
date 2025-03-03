import React from "react";

interface InfoModalProps {
    isOpen: boolean | undefined;
    onOpenChange: () => void;
}

const InfoModal = ({ isOpen, onOpenChange }: InfoModalProps) => {
    return (
        <>
            {isOpen &&
                <div className='fixed top-0 left-0 w-full h-full bg-default flex justify-center items-center'>
                    <div className='max-w-[460px] bg-surface-modal theme-text-sub1 border-x border-y theme-border shadow-lg py-2 rounded-md'>
                        <h2
                            className='text-lg font-medium border-b theme-border py-3 px-4 mb-4'
                        >Don&apos;t know any Hindi words?</h2>
                        <div className='px-4 pb-4'>
                            <p className='text-lg font-medium py-2 pb-4'>
                                Try these Hindi words:
                            </p>
                            <ul className="space-y-2">
                                <li className="p-4 bg-onSurface-modal rounded-lg">
                                    <span className="text-lg font-semibold ">Namaste (नमस्ते)</span>
                                    <p className="theme-text-sub2">A traditional greeting meaning &quot;Hello&quot; or &quot;Greetings.&quot;</p>
                                </li>
                                <li className="p-4 bg-onSurface-modal rounded-lg">
                                    <span className="text-lg font-semibold ">Dhanyavaad (धन्यवाद)</span>
                                    <p className=" theme-text-sub2">A way to express gratitude, meaning &quot;Thank you.&quot;</p>
                                </li>
                                <li className="p-4 bg-onSurface-modal rounded-lg">
                                    <span className="text-lg font-semibold ">Pyaar (प्यार)</span>
                                    <p className=" theme-text-sub2">The word for &quot;Love,&quot; often used to express affection.</p>
                                </li>
                                <li className="p-4 bg-onSurface-modal rounded-lg">
                                    <span className="text-lg font-semibold ">Khushi (खुशी)</span>
                                    <p className=" theme-text-sub2">Means &quot;Happiness&quot; or &quot;Joy.&quot;</p>
                                </li>
                                <li className="p-4 bg-onSurface-modal rounded-lg">
                                    <span className="text-lg font-semibold ">Sapna (सपना)</span>
                                    <p className=" theme-text-sub2">Refers to a &quot;Dream,&quot; either during sleep or a life goal.</p>
                                </li>
                            </ul>
                        </div>
                        <div className='border-t theme-border flex justify-between items-center px-4 pt-2'>
                            <div className='text-sm font-medium '>
                                HinDict
                            </div>
                            <button
                                type='button'
                                className='h-8 px-2 text-sm rounded-md bg-contrast'
                                onClick={onOpenChange}
                            >
                                Okay, thanks!
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default InfoModal;