for path in packages/*; do
    [ -d "${path}" ] || continue # if not a directory, skip
    dirname="$(basename "${path}")"
    echo "${path}"
    zip -r "${dirname}.zip" $path
done
