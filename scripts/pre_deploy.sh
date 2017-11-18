cd packages
for path in *; do
    [ -d "${path}" ] || continue # if not a directory, skip
    dirname="$(basename "${path}")"
    echo "${path}"
    zip -r "../${dirname}.zip" $path
done
