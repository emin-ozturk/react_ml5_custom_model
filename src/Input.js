function Input({ name, setLabel, label, image }) {
    const handleImageChange = (e) => {
        const files = e.target.files;
        const validImageFiles = Array.from(files).map((file) => ({ image: file, label }));
        image(validImageFiles);
    };

    return (
        <div className='bg-white drop-shadow-2xl min-w-[500px] h-44 rounded-lg m-5 p-5'>
            <input
                name={name}
                type='text'
                placeholder='Label'
                className='text-black font-medium'
                onChange={setLabel} />

            <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="input" />
        </div>
    )
};

export default Input;