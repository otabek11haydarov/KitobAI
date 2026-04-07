import urllib.parse
with open('src/data/books.csv', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out_lines = []
out_lines.append(lines[0].strip())
for line in lines[1:]:
    if not line.strip(): continue
    parts = line.strip().split(',')
    
    if len(parts) > 8:
        id_ = parts[0]
        title = parts[1]
        author = parts[2]
        genre = parts[3]
        year = parts[4]
        rating = parts[5]
        desc = ','.join(parts[6:-1])
        if ',' in desc and not desc.startswith('\"'):
            desc = '\"' + desc + '\"'
        img = parts[-1]
    else:
        id_, title, author, genre, year, rating, desc, img = parts

    encoded_title = urllib.parse.quote_plus(title.lower())
    new_img = f'https://covers.openlibrary.org/b/title/{encoded_title}-L.jpg'
    
    out_lines.append(f'{id_},{title},{author},{genre},{year},{rating},{desc},{new_img}')

with open('out.csv', 'w', encoding='utf-8') as f:
    for out in out_lines:
        f.write(out + '\n')
