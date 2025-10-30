// resources/js/Components/ApplicationLogo.jsx
export default function ApplicationLogo(props) {
    return (
        <img
            src="/images/Logo.png" // Path relatif dari folder 'public'
            alt="Logo Aplikasi"
            {...props} // Menerapkan styling dari layout
        />
    );
}