export function slugify(text: string) {
    return text.trim().toLowerCase().replaceAll(" ", '-')
}