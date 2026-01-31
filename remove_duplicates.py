import re
import sys

def remove_duplicates_from_language_context(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by language blocks
    lines = content.split('\n')
    result_lines = []
    current_lang_keys = set()
    in_language_block = False
    brace_count = 0
    
    for i, line in enumerate(lines):
        # Check if we're starting a new language block
        lang_match = re.match(r'\s+(\w+):\s*\{', line)
        if lang_match and brace_count == 1:
            in_language_block = True
            current_lang_keys = set()
            result_lines.append(line)
            continue
        
        # Track braces
        brace_count += line.count('{') - line.count('}')
        
        # If we're in a language block, check for duplicate keys
        if in_language_block:
            key_match = re.match(r'\s+(\w+):', line)
            if key_match:
                key = key_match.group(1)
                if key in current_lang_keys:
                    # Skip this line and the next lines until we find the next key or closing brace
                    print(f"Removing duplicate key: {key} at line {i+1}")
                    # Skip until we find comma or next key
                    continue
                else:
                    current_lang_keys.add(key)
        
        result_lines.append(line)
        
        # Reset when language block ends
        if brace_count == 1 and in_language_block:
            in_language_block = False
            current_lang_keys = set()
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(result_lines))
    
    print("Done! Duplicates removed.")

if __name__ == '__main__':
    remove_duplicates_from_language_context('src/context/LanguageContext.jsx')
