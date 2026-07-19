const StatCard = ({
    title,
    value,
    color,
    icon: Icon
}) => {

    return (

        <div
            className="
            rounded-2xl
            bg-[#111827]
            border
            border-slate-800
            p-6
            transition
            hover:border-cyan-500
            hover:-translate-y-1
        "
        >

            <div className="flex justify-between">

                <div>

                    <p className="text-slate-400">

                        {title}

                    </p>

                    <h2 className="text-4xl font-bold mt-2">

                        {value}

                    </h2>

                </div>

                <div
                    className={`
                    w-14
                    h-14
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    ${color}
                `}
                >

                    <Icon/>

                </div>

            </div>

        </div>

    );

};

export default StatCard;