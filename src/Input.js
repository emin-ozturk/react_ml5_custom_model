function Input({ name, setLabel, label, image }) {
    const handleImageChange = (e) => {
        const files = e.target.files;
        const validImageFiles = Array.from(files).map((file) => ({ image: file, label }));
        image(validImageFiles);
      };

    return (
        <div className='bg-white drop-shadow-2xl w-[600px] h-44 rounded-lg my-5 p-5'>
            <input
                name={name}
                type='text'
                placeholder='Label'
                className='text-black font-medium'
                onChange={setLabel} />

            <input type="file" multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:me-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700 "/>
        </div>
    )
};

export default Input;