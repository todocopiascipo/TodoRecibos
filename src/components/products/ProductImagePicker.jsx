export default function ProductImagePicker({ image, onChange }) {
  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <span className="text-sm font-semibold text-slate-700">Imagen</span>
      <div className="mt-2 grid min-h-48 place-items-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
        {image ? (
          <img src={image} alt="" className="h-full max-h-48 w-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-white text-xl font-black text-teal-700 shadow-sm">P</div>
            <p className="mt-3 text-sm text-slate-500">Sin imagen</p>
          </div>
        )}
      </div>
      <input
        className="mt-3 block w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
}
