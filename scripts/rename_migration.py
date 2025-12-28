import datetime
import sys
import os
import shutil

def generate_timestamp():
    return datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S")

def rename_migration(old_path):
    if not os.path.exists(old_path):
        print(f"Error: File '{old_path}' not found.")
        return

    timestamp = generate_timestamp()
    dirname = os.path.dirname(old_path)
    basename = os.path.basename(old_path)
    
    # Remove existing timestamp/prefix if any (assuming YYYYMMDDHHMMSS_ format or similar)
    # Strategy: split by first underscore if it looks like a timestamp, or just prepend if user wants
    # But for this specific task, we want to replace '20240523000000' with real timestamp.
    
    parts = basename.split('_', 1)
    if len(parts) > 1 and parts[0].isdigit() and len(parts[0]) == 14:
        new_name = f"{timestamp}_{parts[1]}"
    else:
        new_name = f"{timestamp}_{basename}"
        
    new_path = os.path.join(dirname, new_name)
    
    shutil.move(old_path, new_path)
    print(f"Renamed: {basename} -> {new_name}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/rename_migration.py <path_to_migration_file>")
        # Default behavior for the specific task if no arg provided, purely for convenience in this context
        default_file = "supabase/migrations/20240523000000_initial_schema.sql"
        if os.path.exists(default_file):
            rename_migration(default_file)
        else:
            print(f"Default file {default_file} not found. Please provide path.")
    else:
        rename_migration(sys.argv[1])
