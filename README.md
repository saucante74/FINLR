# Finlr

---

## Installation

### 1. Run
```bash
./vendor/bin/sail up -d
```
Or
```bash
docker compose up -d
```

### 2. Generate key
```bash
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate
```

### 3. Run front
```bash
./vendor/bin/sail npm install --legacy-peer-deps
./vendor/bin/sail npm run dev
```
