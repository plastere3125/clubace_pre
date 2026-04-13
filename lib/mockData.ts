export interface Portfolio {
  id: string;
  title: string;
  company: string;
  category: string;
  industry: string;
  revenue: string;
  employees: string;
  description: string;
  fullDescription: string;
  tags: string[];
  imageUrl: string;
  contact: string;
  location: string;
  established: string;
  memberOnly: boolean;
  // 상세페이지 추가 필드
  manager?: string;        // 담당자
  employmentType?: string; // 고용형태
  salary?: string;         // 급여조건
  benefits?: string[];     // 편의사항 태그
  kakaoUrl?: string;       // 카카오톡 채팅 링크
  telegramUrl?: string;    // 텔레그램 링크
  detailImages?: string[]; // 상세내용 이미지 URL 목록
}

export interface Post {
  id: string;
  boardId: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  createdAt: string;
  views: number;
  images?: string[];
  tags?: string[];
}

// ── 1등급 (12개) ──────────────────────────────────────
const TIER1: Portfolio[] = [
  { id: "t1-01", category: "1등급", title: "제주 프리미엄 리조트 개발", company: "골든뷰 리조트", industry: "부동산", revenue: "1,200억", employees: "320명", location: "제주도", established: "2018년", memberOnly: true, imageUrl: "https://picsum.photos/seed/101/600/400", contact: "invest@goldenview.kr", description: "제주 서귀포 해안 5성급 리조트, 시리즈 A 투자 라운드 진행 중", fullDescription: "제주 서귀포 해안가 프리미엄 리조트 개발 프로젝트. 300실 규모 5성급. 초기 투자자 우선 배당권 제공.", tags: ["투자", "리조트", "부동산"] },
  { id: "t1-02", category: "1등급", title: "미슐랭 F&B 프랜차이즈 확장", company: "프라임 다이닝 그룹", industry: "외식", revenue: "850억", employees: "210명", location: "서울 강남", established: "2015년", memberOnly: true, imageUrl: "https://picsum.photos/seed/102/600/400", contact: "partner@primedining.kr", description: "미슐랭 원스타 레스토랑 체인, 국내외 마스터 프랜차이즈 파트너 모집", fullDescription: "2015년 설립. 서울 3개 지점 운영 중. 전국 주요 도시 및 해외 확장 파트너 모집.", tags: ["F&B", "프랜차이즈", "미슐랭"] },
  { id: "t1-03", category: "1등급", title: "항암제 글로벌 임상 3상", company: "바이오넥스트", industry: "바이오", revenue: "2,400억", employees: "580명", location: "판교", established: "2012년", memberOnly: true, imageUrl: "https://picsum.photos/seed/103/600/400", contact: "ir@bionext.kr", description: "FDA 글로벌 임상 3상 진입 성공, 전략적 투자자 모집", fullDescription: "혁신적 항암제 파이프라인 보유. FDA 임상 3상 진입. 2027년 상업화 목표.", tags: ["바이오", "임상", "투자"] },
  { id: "t1-04", category: "1등급", title: "동남아 물류 허브 네트워크", company: "글로벌로지스", industry: "물류", revenue: "3,100억", employees: "1,200명", location: "인천", established: "2010년", memberOnly: false, imageUrl: "https://picsum.photos/seed/104/600/400", contact: "biz@globallogis.kr", description: "동남아 7개국 물류 허브, 한국 파트너 협력사 모집", fullDescription: "동남아 7개국 물류 네트워크 보유. 한국 시장 진출 현지 파트너 모집. 독점 계약 협의 가능.", tags: ["물류", "동남아", "파트너"] },
  { id: "t1-05", category: "1등급", title: "제조업 특화 AI 플랫폼", company: "에이아이코어", industry: "IT", revenue: "760억", employees: "180명", location: "성남", established: "2017년", memberOnly: true, imageUrl: "https://picsum.photos/seed/105/600/400", contact: "enterprise@aicore.kr", description: "국내 대기업 50곳 납품 중, 해외 엔터프라이즈 파트너십 기회", fullDescription: "제조업 특화 AI 솔루션. 대기업 50곳 납품. 해외 진출 및 신규 산업군 확장 파트너십 제공.", tags: ["AI", "B2B", "엔터프라이즈"] },
  { id: "t1-06", category: "1등급", title: "강남 프라임 오피스 빌딩", company: "프라임에셋", industry: "부동산", revenue: "5,800억", employees: "42명", location: "서울 강남", established: "2008년", memberOnly: true, imageUrl: "https://picsum.photos/seed/106/600/400", contact: "asset@primeasset.kr", description: "강남 핵심 업무지구 프라임 오피스 자산, 기관투자자 공동 투자 제안", fullDescription: "강남 핵심 업무지구 A급 오피스. 100% 임차율 유지 중. 기관투자자 공동 투자 제안.", tags: ["부동산", "오피스", "자산"] },
  { id: "t1-07", category: "1등급", title: "핀테크 글로벌 결제 플랫폼", company: "페이넥서스", industry: "금융", revenue: "1,050억", employees: "290명", location: "서울 여의도", established: "2016년", memberOnly: true, imageUrl: "https://picsum.photos/seed/107/600/400", contact: "global@paynexus.kr", description: "동남아·중동 18개국 결제 인프라, 시리즈 B 라운드 진행 중", fullDescription: "18개국 결제 인프라 보유. MAU 240만. 시리즈 B 투자 라운드 진행 중.", tags: ["핀테크", "결제", "글로벌"] },
  { id: "t1-08", category: "1등급", title: "스마트팜 수직 농업 플랫폼", company: "그린팩토리", industry: "농업·식품", revenue: "430억", employees: "150명", location: "세종", established: "2019년", memberOnly: false, imageUrl: "https://picsum.photos/seed/108/600/400", contact: "partner@greenfactory.kr", description: "연간 1,200톤 생산 스마트팜, 해외 라이선스 파트너 모집", fullDescription: "수직농업 기술 기반 스마트팜. 연 1,200톤 생산. 일본·싱가포르 진출 라이선스 파트너 모집.", tags: ["스마트팜", "농업", "라이선스"] },
  { id: "t1-09", category: "1등급", title: "전기차 배터리 재활용 기술", company: "그린배터리", industry: "환경·에너지", revenue: "920억", employees: "340명", location: "울산", established: "2014년", memberOnly: true, imageUrl: "https://picsum.photos/seed/109/600/400", contact: "ir@greenbattery.kr", description: "폐배터리 재활용 기술 세계 특허 보유, 유럽 진출 파트너 모집", fullDescription: "폐배터리 재활용 원천기술 보유. 세계 특허 14건. EU 진출 현지 파트너 모집.", tags: ["배터리", "재활용", "환경"] },
  { id: "t1-10", category: "1등급", title: "의료 AI 진단 솔루션", company: "메디컬AI", industry: "의료", revenue: "680억", employees: "220명", location: "서울 마포", established: "2016년", memberOnly: true, imageUrl: "https://picsum.photos/seed/110/600/400", contact: "biz@medicalai.kr", description: "영상 판독 AI 솔루션, 국내 병원 200곳 도입, 해외 의료기관 파트너 모집", fullDescription: "의료 영상 AI 판독 솔루션. 국내 병원 200곳 도입. FDA 인증 추진 중. 해외 파트너 모집.", tags: ["의료", "AI", "진단"] },
  { id: "t1-11", category: "1등급", title: "럭셔리 호텔 체인 운영사", company: "그랜드스테이", industry: "관광·숙박", revenue: "1,740억", employees: "860명", location: "서울 강북", established: "2011년", memberOnly: false, imageUrl: "https://picsum.photos/seed/111/600/400", contact: "invest@grandstay.kr", description: "국내 6개 5성급 호텔 운영, 동남아 신규 호텔 공동 개발 파트너 모집", fullDescription: "국내 5성급 호텔 6개 운영. 객실 점유율 87% 유지. 동남아 신규 호텔 공동 개발 파트너 모집.", tags: ["호텔", "럭셔리", "투자"] },
  { id: "t1-12", category: "1등급", title: "반도체 소재 기술 기업", company: "나노머티리얼", industry: "제조·소재", revenue: "2,100억", employees: "410명", location: "수원", established: "2009년", memberOnly: true, imageUrl: "https://picsum.photos/seed/112/600/400", contact: "biz@nanomaterial.kr", description: "삼성·SK 납품 반도체 소재 기업, 해외 파트너십 확대 모집", fullDescription: "반도체 핵심 소재 기술 보유. 삼성·SK 주요 납품사. 미국·일본 현지 파트너십 확대 모집.", tags: ["반도체", "소재", "제조"] },
];

// ── 2등급 (12개) ──────────────────────────────────────
const TIER2: Portfolio[] = [
  { id: "t2-01", category: "2등급", title: "강남 프리미엄 뷰티 클리닉", company: "라핀뷰티", industry: "뷰티·의료", revenue: "95억", employees: "68명", location: "서울 강남", established: "2017년", memberOnly: true, imageUrl: "https://picsum.photos/seed/201/600/400", contact: "biz@lapinbeauty.kr", description: "강남 직영 6개점, 의료 뷰티 프랜차이즈 파트너 모집", fullDescription: "강남 직영 6개점 운영. 연 매출 95억. 의료 뷰티 프랜차이즈 전국 확장 파트너 모집.", tags: ["뷰티", "클리닉", "프랜차이즈"] },
  { id: "t2-02", category: "2등급", title: "온라인 교육 플랫폼 운영사", company: "에듀링크", industry: "교육", revenue: "138억", employees: "92명", location: "서울 마포", established: "2018년", memberOnly: false, imageUrl: "https://picsum.photos/seed/202/600/400", contact: "partner@edulink.kr", description: "월 활성 사용자 15만 명, B2B 기업 교육 파트너십 모집", fullDescription: "온라인 교육 플랫폼. MAU 15만. B2B 기업교육 솔루션 확장 파트너십 모집.", tags: ["교육", "플랫폼", "B2B"] },
  { id: "t2-03", category: "2등급", title: "프리미엄 펫케어 브랜드", company: "퍼피러브", industry: "반려동물", revenue: "72억", employees: "55명", location: "성남", established: "2019년", memberOnly: true, imageUrl: "https://picsum.photos/seed/203/600/400", contact: "biz@puppylove.kr", description: "국내 반려동물 케어 상위 3위, 해외 유통 파트너 모집", fullDescription: "프리미엄 펫케어 제품 브랜드. 국내 3위. 일본·대만 유통 파트너 모집.", tags: ["반려동물", "펫케어", "유통"] },
  { id: "t2-04", category: "2등급", title: "전통주 프리미엄 브랜딩 기업", company: "한주양조", industry: "주류·식품", revenue: "88억", employees: "43명", location: "전주", established: "2016년", memberOnly: false, imageUrl: "https://picsum.photos/seed/204/600/400", contact: "export@hanjubrewery.kr", description: "K-전통주 수출 브랜드, 미국·유럽 유통 파트너 모집", fullDescription: "프리미엄 전통주 브랜딩. 미국·유럽 수출 개시. 현지 유통 파트너 모집.", tags: ["전통주", "수출", "K-푸드"] },
  { id: "t2-05", category: "2등급", title: "물류 SaaS 스타트업", company: "로지테크", industry: "IT·물류", revenue: "61억", employees: "78명", location: "판교", established: "2020년", memberOnly: true, imageUrl: "https://picsum.photos/seed/205/600/400", contact: "sales@logitech.kr", description: "중소물류사 대상 SaaS 솔루션, 고객사 320곳, 투자자 모집", fullDescription: "물류 관리 SaaS. 고객사 320곳. 시리즈 A 투자 라운드 진행 중.", tags: ["SaaS", "물류", "스타트업"] },
  { id: "t2-06", category: "2등급", title: "친환경 패키징 제조사", company: "그린팩", industry: "제조·환경", revenue: "145억", employees: "190명", location: "인천", established: "2014년", memberOnly: false, imageUrl: "https://picsum.photos/seed/206/600/400", contact: "biz@greenpack.kr", description: "생분해 포장재 국내 1위, 해외 수출 파트너 모집", fullDescription: "친환경 생분해 포장재 제조. 국내 시장 점유율 1위. 유럽·북미 수출 파트너 모집.", tags: ["친환경", "패키징", "수출"] },
  { id: "t2-07", category: "2등급", title: "건강기능식품 D2C 브랜드", company: "뉴트리온", industry: "건강·식품", revenue: "113억", employees: "65명", location: "서울 송파", established: "2019년", memberOnly: true, imageUrl: "https://picsum.photos/seed/207/600/400", contact: "partner@nutrion.kr", description: "구독 모델 건기식 브랜드, 회원 8만 명, 해외 진출 파트너 모집", fullDescription: "구독 기반 건강기능식품 D2C. 회원 8만. 미국·동남아 진출 파트너 모집.", tags: ["건기식", "D2C", "구독"] },
  { id: "t2-08", category: "2등급", title: "HR테크 채용 자동화 플랫폼", company: "탤런트링크", industry: "HR·IT", revenue: "57억", employees: "84명", location: "서울 마포", established: "2020년", memberOnly: true, imageUrl: "https://picsum.photos/seed/208/600/400", contact: "biz@talentlink.kr", description: "AI 기반 채용 자동화, 기업 고객 450곳, 시리즈 A 파트너 모집", fullDescription: "AI 채용 자동화 플랫폼. 기업 고객 450곳. 시리즈 A 공동 투자자 모집.", tags: ["HR테크", "AI", "채용"] },
  { id: "t2-09", category: "2등급", title: "국내 1위 세차 프랜차이즈", company: "클린카", industry: "자동차 서비스", revenue: "205억", employees: "310명", location: "서울 강서", established: "2013년", memberOnly: false, imageUrl: "https://picsum.photos/seed/209/600/400", contact: "franchise@cleancar.kr", description: "전국 직영·가맹 180개점, 신규 지역 마스터 프랜차이즈 모집", fullDescription: "국내 세차 프랜차이즈 1위. 직영·가맹 180개점. 신규 지역 마스터 프랜차이즈 모집.", tags: ["프랜차이즈", "자동차", "서비스"] },
  { id: "t2-10", category: "2등급", title: "웨딩 플래닝 & 콘텐츠 기업", company: "드림웨딩", industry: "웨딩·이벤트", revenue: "67억", employees: "88명", location: "서울 강남", established: "2016년", memberOnly: true, imageUrl: "https://picsum.photos/seed/210/600/400", contact: "biz@dreamwedding.kr", description: "연간 1,200건 웨딩 플래닝, 동남아 진출 파트너 모집", fullDescription: "프리미엄 웨딩 플래닝. 연간 1,200건 시공. 베트남·태국 진출 파트너 모집.", tags: ["웨딩", "이벤트", "해외진출"] },
  { id: "t2-11", category: "2등급", title: "도심 공유 오피스 운영사", company: "오피스허브", industry: "부동산·공유", revenue: "178억", employees: "125명", location: "서울 종로", established: "2018년", memberOnly: false, imageUrl: "https://picsum.photos/seed/211/600/400", contact: "invest@officehub.kr", description: "전국 35개 지점 운영, 신규 거점 공동 투자 파트너 모집", fullDescription: "도심 공유 오피스 35개 지점. 입주율 92%. 신규 거점 공동 투자 파트너 모집.", tags: ["공유오피스", "부동산", "투자"] },
  { id: "t2-12", category: "2등급", title: "자동화 제조 로봇 솔루션", company: "로보팩토리", industry: "제조·로봇", revenue: "234억", employees: "155명", location: "창원", established: "2015년", memberOnly: true, imageUrl: "https://picsum.photos/seed/212/600/400", contact: "biz@robofactory.kr", description: "중소 제조공장 자동화 로봇, 도입 공장 85곳, 해외 파트너 모집", fullDescription: "중소 제조공장 자동화 로봇 솔루션. 도입 공장 85곳. 동남아·중동 현지 파트너 모집.", tags: ["로봇", "자동화", "제조"] },
];

// ── 3등급 (36개) ──────────────────────────────────────
const TIER3_RAW = [
  { title: "카페 프랜차이즈 직영 확장", company: "브루잉데이", industry: "외식", revenue: "28억", employees: "42명", location: "서울", desc: "가맹 희망 지역 파트너 모집" },
  { title: "인테리어 시공 전문기업", company: "스페이스워크", industry: "인테리어", revenue: "35억", employees: "38명", location: "서울 강남", desc: "대형 오피스·상업공간 시공 파트너 모집" },
  { title: "헬스케어 앱 서비스", company: "핏라이프", industry: "헬스케어", revenue: "19억", employees: "31명", location: "판교", desc: "MAU 8만, 헬스장 B2B 파트너 모집" },
  { title: "공방 클래스 플랫폼", company: "클래스모아", industry: "교육·취미", revenue: "14억", employees: "22명", location: "서울 홍대", desc: "전국 공방 입점 파트너 모집" },
  { title: "중고 명품 거래 플랫폼", company: "럭스세컨", industry: "리세일", revenue: "47억", employees: "55명", location: "서울 강남", desc: "국내외 바이어·셀러 파트너 모집" },
  { title: "키즈 영어 학원 체인", company: "리틀링귀스트", industry: "교육", revenue: "32억", employees: "78명", location: "서울 서초", desc: "신도시 프랜차이즈 파트너 모집" },
  { title: "수제 맥주 양조장", company: "홉앤몰트", industry: "주류", revenue: "18억", employees: "25명", location: "부산", desc: "편의점·마트 유통 파트너 모집" },
  { title: "소규모 물류 대행사", company: "퀵델리버리", industry: "물류", revenue: "41억", employees: "92명", location: "경기 광주", desc: "라스트마일 배송 파트너 모집" },
  { title: "온라인 인쇄 플랫폼", company: "프린트온", industry: "인쇄·출판", revenue: "23억", employees: "28명", location: "서울 구로", desc: "법인 고객 대량 인쇄 파트너 모집" },
  { title: "반찬 구독 서비스", company: "오늘의반찬", industry: "식품", revenue: "16억", employees: "34명", location: "서울 노원", desc: "수도권 배달망 파트너 모집" },
  { title: "주차장 운영 솔루션", company: "파킹맵", industry: "IT·교통", revenue: "29억", employees: "19명", location: "서울 영등포", desc: "주차장 운영사 솔루션 파트너 모집" },
  { title: "맞춤 정장 제작 브랜드", company: "수트살롱", industry: "패션", revenue: "12억", employees: "16명", location: "서울 강남", desc: "법인 임직원 단체 정장 파트너 모집" },
  { title: "B2B 세무 자동화 SaaS", company: "택스봇", industry: "세무·IT", revenue: "22억", employees: "27명", location: "판교", desc: "세무사 사무소·회계법인 파트너 모집" },
  { title: "소형 창고 임대 서비스", company: "스토리지박스", industry: "부동산", revenue: "38억", employees: "21명", location: "경기 하남", desc: "개인·소상공인 창고 입점 파트너 모집" },
  { title: "홈클리닝 O2O 플랫폼", company: "클린매니저", industry: "생활서비스", revenue: "44억", employees: "61명", location: "서울", desc: "청소 대행 프리랜서 파트너 모집" },
  { title: "가구 구독·렌탈 서비스", company: "퍼니처플러스", industry: "가구·인테리어", revenue: "31억", employees: "38명", location: "서울 양천", desc: "이사·입주 서비스 연계 파트너 모집" },
  { title: "유기농 화장품 브랜드", company: "네이처글로우", industry: "뷰티", revenue: "26억", employees: "33명", location: "서울 성동", desc: "H&B스토어 입점·유통 파트너 모집" },
  { title: "노무·HR 컨설팅 서비스", company: "노무파트너스", industry: "컨설팅", revenue: "17억", employees: "24명", location: "서울 서초", desc: "중소기업 HR 아웃소싱 파트너 모집" },
  { title: "전통식품 온라인 판매", company: "한식몰", industry: "식품·유통", revenue: "21억", employees: "18명", location: "경북 안동", desc: "해외 한식 마니아 대상 수출 파트너 모집" },
  { title: "이사 전문 운송 서비스", company: "무빙프로", industry: "이사·물류", revenue: "36억", employees: "74명", location: "경기 의정부", desc: "기업 이전 특수 이사 파트너 모집" },
  { title: "스마트 빌딩 관리 솔루션", company: "빌딩아이오티", industry: "IT·건물관리", revenue: "43억", employees: "46명", location: "서울 중구", desc: "빌딩 관리업체 솔루션 파트너 모집" },
  { title: "크리에이터 매니지먼트", company: "크리에이티브허브", industry: "미디어·콘텐츠", revenue: "24억", employees: "29명", location: "서울 마포", desc: "SNS 크리에이터 협업 파트너 모집" },
  { title: "드론 방제 서비스", company: "에어팜", industry: "농업·드론", revenue: "15억", employees: "21명", location: "전남 나주", desc: "지역 농협·농가 파트너 모집" },
  { title: "AI 번역 솔루션", company: "트랜스레이터AI", industry: "IT·언어", revenue: "19억", employees: "23명", location: "판교", desc: "글로벌 기업 문서 번역 파트너 모집" },
  { title: "유아용품 렌탈 서비스", company: "베이비렌탈", industry: "유아·육아", revenue: "13억", employees: "17명", location: "경기 고양", desc: "산후조리원·육아서비스 연계 파트너 모집" },
  { title: "맞춤형 투어 여행사", company: "프라이빗트래블", industry: "여행", revenue: "27억", employees: "31명", location: "서울 강남", desc: "해외 럭셔리 여행 현지 파트너 모집" },
  { title: "오피스 용품 B2B 쇼핑몰", company: "오피스메이트", industry: "유통·B2B", revenue: "52억", employees: "44명", location: "서울 금천", desc: "중견·대기업 구매 담당자 파트너 모집" },
  { title: "폐기물 수거·재활용", company: "리사이클코", industry: "환경", revenue: "33억", employees: "57명", location: "경기 안산", desc: "사업장 폐기물 처리 계약 파트너 모집" },
  { title: "반도체 장비 유지보수", company: "테크서비스", industry: "반도체·장비", revenue: "48억", employees: "63명", location: "화성", desc: "팹리스·파운드리 장비 유지보수 파트너 모집" },
  { title: "온라인 약국 플랫폼", company: "팜링크", industry: "의약·헬스케어", revenue: "39억", employees: "35명", location: "서울 종로", desc: "약사·의원 연계 파트너 모집" },
  { title: "캠핑 장비 렌탈 플랫폼", company: "캠프렌탈", industry: "레저·스포츠", revenue: "11억", employees: "14명", location: "강원 춘천", desc: "캠핑장·리조트 연계 파트너 모집" },
  { title: "건축자재 유통 전문사", company: "빌드마트", industry: "건축·유통", revenue: "76억", employees: "82명", location: "경기 부천", desc: "건설사·시공사 납품 파트너 모집" },
  { title: "SNS 마케팅 대행사", company: "소셜부스트", industry: "마케팅", revenue: "20억", employees: "26명", location: "서울 강남", desc: "중소기업 SNS 운영 대행 파트너 모집" },
  { title: "식물성 단백질 식품", company: "플랜트푸드", industry: "식품·건강", revenue: "18억", employees: "22명", location: "서울 성수", desc: "비건 레스토랑·카페 납품 파트너 모집" },
  { title: "전동 킥보드 공유 서비스", company: "스쿠터고", industry: "모빌리티", revenue: "37억", employees: "49명", location: "서울 강남", desc: "대학가·오피스 밀집지역 운영 파트너 모집" },
  { title: "클라우드 보안 솔루션", company: "시큐어클라우드", industry: "IT·보안", revenue: "54억", employees: "67명", location: "판교", desc: "금융·공공기관 보안 솔루션 파트너 모집" },
  { title: "명상·마음챙김 앱", company: "마인드풀", industry: "헬스케어·앱", revenue: "9억", employees: "12명", location: "서울 홍대", desc: "기업 복지 프로그램 B2B 파트너 모집" },
];

const TIER3: Portfolio[] = TIER3_RAW.map((d, i) => ({
  id: `t3-${String(i + 1).padStart(2, "0")}`,
  category: "3등급",
  title: d.title,
  company: d.company,
  industry: d.industry,
  revenue: d.revenue,
  employees: d.employees,
  location: d.location,
  established: `${2014 + (i % 8)}년`,
  memberOnly: i % 4 !== 0,
  imageUrl: `https://picsum.photos/seed/${300 + i}/600/400`,
  contact: `contact@${d.company.replace(/\s/g, "").toLowerCase()}.kr`,
  description: d.desc,
  fullDescription: `${d.company}는 ${d.industry} 분야 전문 기업입니다. ${d.desc}`,
  tags: [d.industry, "파트너모집"],
}));

// ── 4등급 (10개) ──────────────────────────────────────
const TIER4: Portfolio[] = [
  { id: "t4-01", category: "4등급", title: "지역 세탁소 체인", company: "깨끗한세탁", industry: "생활서비스", revenue: "4억", employees: "8명", location: "경기 수원", established: "2020년", memberOnly: false, imageUrl: "https://picsum.photos/seed/401/600/400", contact: "info@cleanlaundry.kr", description: "수원 5개점, 인근 지역 공동 운영 파트너 모집", fullDescription: "수원 지역 세탁소 체인 5개점. 인근 지역 공동 운영 파트너 모집.", tags: ["세탁", "생활서비스"] },
  { id: "t4-02", category: "4등급", title: "소형 편의점 가맹 모집", company: "동네마트", industry: "유통·소매", revenue: "7억", employees: "12명", location: "서울 관악", established: "2019년", memberOnly: false, imageUrl: "https://picsum.photos/seed/402/600/400", contact: "info@dongnemaret.kr", description: "관악구 직영 3개점, 신규 가맹점 모집", fullDescription: "관악구 직영 편의점 3개점 운영. 신규 가맹점주 모집.", tags: ["편의점", "가맹"] },
  { id: "t4-03", category: "4등급", title: "학원 운영 노하우 공유", company: "에듀팜", industry: "교육", revenue: "5억", employees: "9명", location: "경기 일산", established: "2018년", memberOnly: false, imageUrl: "https://picsum.photos/seed/403/600/400", contact: "info@edufarm.kr", description: "중·고등 수학학원 3개점, 공동 교재 개발 파트너 모집", fullDescription: "중·고등 수학 전문 학원 3개점. 공동 교재 개발 파트너 모집.", tags: ["학원", "교육"] },
  { id: "t4-04", category: "4등급", title: "꽃집 배달 구독 서비스", company: "플라워박스", industry: "꽃·선물", revenue: "3억", employees: "6명", location: "서울 용산", established: "2021년", memberOnly: false, imageUrl: "https://picsum.photos/seed/404/600/400", contact: "info@flowerbox.kr", description: "월 정기 구독 300명, 기업 선물 납품 파트너 모집", fullDescription: "월정기구독 300명 보유. 기업 명절 선물 납품 파트너 모집.", tags: ["꽃", "구독", "선물"] },
  { id: "t4-05", category: "4등급", title: "네일샵 가맹점 모집", company: "핑크네일", industry: "뷰티", revenue: "6억", employees: "14명", location: "서울 은평", established: "2020년", memberOnly: false, imageUrl: "https://picsum.photos/seed/405/600/400", contact: "info@pinknail.kr", description: "은평구·마포구 직영 4개점, 신규 가맹 모집", fullDescription: "은평·마포 네일샵 직영 4개점. 신규 가맹점주 모집.", tags: ["네일", "뷰티", "가맹"] },
  { id: "t4-06", category: "4등급", title: "반찬가게 운영 가맹", company: "엄마손반찬", industry: "식품", revenue: "5억", employees: "11명", location: "경기 부천", established: "2019년", memberOnly: false, imageUrl: "https://picsum.photos/seed/406/600/400", contact: "info@mommyrefood.kr", description: "부천 직영 2개점, 프랜차이즈 가맹 모집", fullDescription: "부천 직영 반찬가게 2개점. 프랜차이즈 가맹점주 모집.", tags: ["반찬", "식품", "가맹"] },
  { id: "t4-07", category: "4등급", title: "소형 세차장 무인 운영", company: "오토케어", industry: "자동차", revenue: "4억", employees: "3명", location: "경기 안양", established: "2022년", memberOnly: false, imageUrl: "https://picsum.photos/seed/407/600/400", contact: "info@autocare.kr", description: "무인 셀프세차 3개점, 공동 운영 파트너 모집", fullDescription: "무인 셀프세차장 3개점 운영. 공동 투자·운영 파트너 모집.", tags: ["세차", "무인", "자동차"] },
  { id: "t4-08", category: "4등급", title: "폰케이스 커스텀 제작", company: "케이스팩토리", industry: "제조·커스텀", revenue: "2억", employees: "5명", location: "서울 동대문", established: "2021년", memberOnly: false, imageUrl: "https://picsum.photos/seed/408/600/400", contact: "info@casefactory.kr", description: "온라인 커스텀 폰케이스, 오프라인 팝업 파트너 모집", fullDescription: "온라인 커스텀 폰케이스 제작. 오프라인 팝업스토어 파트너 모집.", tags: ["커스텀", "폰케이스", "제조"] },
  { id: "t4-09", category: "4등급", title: "중고 가전 매입·판매", company: "리유즈마켓", industry: "리세일", revenue: "8억", employees: "15명", location: "서울 노원", established: "2018년", memberOnly: false, imageUrl: "https://picsum.photos/seed/409/600/400", contact: "info@reusemarket.kr", description: "중고 가전·가구 매입 전문, 지역 매입 파트너 모집", fullDescription: "중고 가전·가구 매입·판매. 지역 거점 매입 파트너 모집.", tags: ["중고", "리세일", "가전"] },
  { id: "t4-10", category: "4등급", title: "유튜브 편집 대행 서비스", company: "영상공장", industry: "콘텐츠·영상", revenue: "3억", employees: "7명", location: "서울 마포", established: "2022년", memberOnly: false, imageUrl: "https://picsum.photos/seed/410/600/400", contact: "info@videofactory.kr", description: "유튜버·기업 채널 편집 대행, 월정액 구독 파트너 모집", fullDescription: "유튜버·기업 유튜브 채널 영상 편집 대행. 월정액 구독 파트너 모집.", tags: ["영상편집", "유튜브", "콘텐츠"] },
];

export const PORTFOLIO_MOCK: Portfolio[] = [...TIER1, ...TIER2, ...TIER3, ...TIER4];

export interface Board {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const BOARDS: Board[] = [
  { id: "lounge", name: "멤버 라운지", description: "회원 전용 자유 토론 공간", icon: "◆" },
  { id: "deal", name: "딜 제안", description: "투자 및 협업 제안 게시판", icon: "◈" },
  { id: "insight", name: "비즈니스 인사이트", description: "시장 분석 및 인사이트 공유", icon: "◇" },
  { id: "network", name: "네트워킹", description: "미팅 요청 및 네트워킹 게시판", icon: "◉" },
];

export const POSTS_MOCK: Post[] = Array.from({ length: 30 }, (_, i) => ({
  id: `post${i + 1}`,
  boardId: BOARDS[i % 4].id,
  title: [
    "2026년 상반기 투자 포트폴리오 공유합니다",
    "AI 시대 제조업 혁신 전략",
    "동남아 시장 진출 경험 공유",
    "바이오텍 투자 기회 소개",
    "프리미엄 F&B 트렌드 분석",
  ][i % 5],
  content: `프리미엄 비즈니스 네트워크 회원 여러분께 공유드립니다. ${["이번 분기 주요 투자 성과와 향후 전략을 공유합니다.", "AI 기술이 제조업에 미치는 영향과 대응 전략을 분석했습니다.", "베트남 및 태국 시장 진출 시 고려해야 할 핵심 요소들입니다.", "글로벌 임상 진입 바이오텍 기업들의 투자 포인트를 정리했습니다.", "2026년 프리미엄 다이닝 시장의 주요 트렌드를 분석합니다."][i % 5]}`,
  author: ["김재원", "이상훈", "박지민", "최예린", "정현우"][i % 5],
  authorRole: ["gold", "silver", "gold", "bronze", "admin"][i % 5],
  createdAt: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
  views: Math.floor(Math.random() * 500) + 50,
  tags: [["투자", "포트폴리오"], ["AI", "제조"], ["해외진출", "동남아"], ["바이오", "투자"], ["F&B", "트렌드"]][i % 5],
}));
