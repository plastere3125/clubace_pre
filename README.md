# 프리미엄 비즈니스 플랫폼 v1.0

프라이빗 멤버십 기반 비즈니스 포트폴리오 플랫폼입니다.

---

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Inline Styles
- **Animation**: Framer Motion
- **State**: React Context + localStorage

---

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
# → http://localhost:3000
```

---

## 테스트 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| 관리자 | admin@premium.com | admin123 |
| GOLD | gold@premium.com | gold123 |
| SILVER | silver@premium.com | silver123 |
| BRONZE | bronze@premium.com | bronze123 |

---

## 주요 기능

### 포트폴리오
- 1~4등급 계층 구조 포트폴리오 전시
- 등급별 자동 순환 (1분 간격)
- 썸네일 파일 업로드 지원

### 관리자 페이지 (`/admin`)

| 섹션 | 기능 |
|------|------|
| 브랜드 설정 | 로고, 태그라인 |
| 포트폴리오 | CRUD, 등급 이름 변경 |
| 등급 권한 | 열람 범위 설정 |
| 회원 관리 | 승인/반려/등급 변경/삭제 |
| 게시판 관리 | 아이콘/이름/설명 |
| 고객센터 | 카카오 오픈채팅 URL 등록 |

### 고객센터 플로팅 버튼
- 포트폴리오 · 커뮤니티 · 로그인 페이지 우측 하단 고정
- 관리자 페이지에서 카카오 오픈채팅 URL 등록 시 클릭 활성화

### 역할 기반 접근 제어
- `admin` → 대시보드 접근 가능
- `gold / silver / bronze` → 포트폴리오로 자동 이동

---

## 폴더 구조

```
app/
├── page.tsx              # 로그인
├── dashboard/            # 관리자 대시보드
├── portfolio/            # 포트폴리오
├── community/            # 커뮤니티 게시판
├── admin/                # 관리자 패널
└── auth/                 # 회원가입 / 로그인

components/
├── Navbar.tsx
├── PortfolioCard.tsx
├── PortfolioModal.tsx
└── FloatingSupport.tsx   # 고객센터 플로팅 버튼

context/
├── AuthContext.tsx        # 인증 상태
└── SiteContext.tsx        # 전체 사이트 설정 (localStorage 저장)
```

---

## 배포 (Vercel 권장)

```bash
npm run build
```

또는 [Vercel](https://vercel.com) 에 GitHub 레포지토리 연결 후 자동 배포.
