================================================================================
                    Weather 4 Cuts - UI 스타일 가이드
================================================================================

프로젝트명: Weather 4 Cuts
버전: 1.0.0
작성일: 2025년 11월 23일
디자인 시스템: daisyUI 5.5.5 (Tailwind CSS 기반)
테마: Nord Theme


================================================================================
1. 컬러 팔레트 (Nord Theme)
================================================================================

■ Primary Colors (주요 색상)
  - Primary: #5E81AC (푸른 회색, 주요 버튼 및 강조)
  - Secondary: #81A1C1 (밝은 청색, 보조 버튼)
  - Accent: #88C0D0 (청록색, 포인트 요소)

■ Semantic Colors (의미론적 색상)
  - Success: #A3BE8C (초록색, 성공/완료 상태)
  - Warning: #EBCB8B (노란색, 경고/주의)
  - Error: #BF616A (붉은색, 오류/삭제)
  - Info: #81A1C1 (청색, 정보)

■ Neutral Colors (중립 색상)
  - Base-100: #2E3440 (기본 배경)
  - Base-200: #3B4252 (카드 배경)
  - Base-300: #434C5E (입력 필드 배경)
  - Base-Content: #ECEFF4 (기본 텍스트)

■ Additional Colors (추가 색상)
  - Snow Storm: #D8DEE9, #E5E9F0, #ECEFF4 (밝은 텍스트 레이어)
  - Polar Night: #2E3440, #3B4252, #434C5E, #4C566A (어두운 배경 레이어)
  - Frost: #8FBCBB, #88C0D0, #81A1C1, #5E81AC (청색 계열 강조)
  - Aurora: #BF616A, #D08770, #EBCB8B, #A3BE8C, #B48EAD (의미론적 색상)


================================================================================
2. 타이포그래피
================================================================================

■ 폰트 패밀리
  - 기본 폰트: system-ui, -apple-system, sans-serif
  - 코드 폰트: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas

■ 폰트 크기 (Tailwind CSS 기준)
  - text-xs: 0.75rem (12px) - 작은 라벨, Badge
  - text-sm: 0.875rem (14px) - 보조 텍스트
  - text-base: 1rem (16px) - 기본 본문
  - text-lg: 1.125rem (18px) - 큰 본문
  - text-xl: 1.25rem (20px) - 소제목
  - text-2xl: 1.5rem (24px) - 중제목
  - text-3xl: 1.875rem (30px) - 대제목
  - text-4xl: 2.25rem (36px) - 특대 제목

■ 폰트 굵기
  - font-normal: 400 - 일반 텍스트
  - font-medium: 500 - 중간 강조
  - font-semibold: 600 - 부제목, 강조
  - font-bold: 700 - 제목, 강한 강조

■ 사용 예시
  - 페이지 제목: text-3xl font-bold text-primary
  - 카드 제목: text-2xl card-title
  - 본문: text-base text-base-content
  - 설명 텍스트: text-sm text-base-content/70


================================================================================
3. 버튼 스타일
================================================================================

■ 기본 버튼 클래스
  클래스명: btn
  속성: 
    - 패딩: 0.5rem 1rem
    - 둥근 모서리: border-radius: 0.5rem
    - 전환 효과: transition-all 0.2s
    - 그림자: shadow-lg

■ 버튼 변형 (Variants)

1) Primary 버튼 (주요 액션)
   클래스: btn btn-primary
   색상: #5E81AC (배경), white (텍스트)
   사용처: 촬영하기, 주요 제출 버튼
   예시: <button className="btn btn-primary">촬영하기</button>

2) Secondary 버튼 (보조 액션)
   클래스: btn btn-secondary
   색상: #81A1C1 (배경), white (텍스트)
   사용처: 보조 기능, 부가 액션

3) Success 버튼 (완료/성공)
   클래스: btn btn-success
   색상: #A3BE8C (배경), white (텍스트)
   사용처: 완료, 저장, 제출
   예시: <button className="btn btn-success">완성! 결과 보기</button>

4) Warning 버튼 (경고/주의)
   클래스: btn btn-warning
   색상: #EBCB8B (배경), white (텍스트)
   사용처: 다시 촬영, 취소, 재시도

5) Outline 버튼 (외곽선)
   클래스: btn btn-outline
   색상: 투명 배경, 컬러 테두리
   사용처: 보조 옵션, 덜 중요한 액션

6) Ghost 버튼 (텍스트형)
   클래스: btn btn-ghost
   색상: 투명 배경, 호버 시 배경 나타남
   사용처: 닫기, 취소, 뒤로가기

■ 버튼 크기

1) Small (작은 크기)
   클래스: btn btn-sm
   높이: 2rem (32px)
   사용처: 작은 공간, 인라인 버튼

2) Normal (기본 크기)
   클래스: btn
   높이: 3rem (48px)
   사용처: 일반적인 모든 버튼

3) Large (큰 크기)
   클래스: btn btn-lg
   높이: 4rem (64px)
   사용처: 주요 CTA 버튼, 중요한 액션
   예시: <button className="btn btn-primary btn-lg">촬영하기</button>

4) Wide (가로로 넓은)
   클래스: btn btn-wide
   최소 너비: 16rem
   사용처: 강조가 필요한 주요 버튼

■ 버튼 상태

1) Disabled (비활성)
   속성: disabled={true}
   스타일: 불투명도 50%, 포인터 이벤트 없음
   예시: <button className="btn" disabled>촬영 (4/4)</button>

2) Loading (로딩 중)
   클래스: btn + <span className="loading loading-spinner"></span>
   사용처: 비동기 작업 진행 중
   예시:
   <button className="btn btn-success" disabled>
     <span className="loading loading-spinner"></span>
     저장 중...
   </button>

■ 아이콘과 함께 사용
  클래스: gap-2 추가
  예시:
  <button className="btn btn-primary gap-2">
    <svg>...</svg>
    촬영하기
  </button>


================================================================================
4. 입력 필드 스타일
================================================================================

■ 기본 Input
  클래스: input input-bordered
  속성:
    - 배경: bg-base-300
    - 테두리: 1px solid (base-content/20)
    - 패딩: 0.5rem 1rem
    - 둥근 모서리: border-radius: 0.5rem
  
  예시:
  <input 
    type="text" 
    className="input input-bordered w-full" 
    placeholder="텍스트를 입력하세요"
  />

■ Input 변형

1) Primary Input
   클래스: input input-bordered input-primary
   테두리 색상: Primary (#5E81AC)
   사용처: 주요 입력 필드

2) Success Input
   클래스: input input-bordered input-success
   테두리 색상: Success (#A3BE8C)
   사용처: 유효성 검증 통과

3) Error Input
   클래스: input input-bordered input-error
   테두리 색상: Error (#BF616A)
   사용처: 유효성 검증 실패

■ Input 크기

1) Small
   클래스: input input-sm
   높이: 2rem

2) Normal
   클래스: input
   높이: 3rem

3) Large
   클래스: input input-lg
   높이: 4rem

■ Textarea (다중 행 입력)
  클래스: textarea textarea-bordered
  속성:
    - 최소 높이: 6rem
    - 리사이즈: vertical
  
  예시:
  <textarea 
    className="textarea textarea-bordered w-full" 
    placeholder="내용을 입력하세요"
    rows="4"
  ></textarea>

■ Select (드롭다운)
  클래스: select select-bordered
  
  예시:
  <select className="select select-bordered w-full">
    <option disabled selected>선택하세요</option>
    <option>옵션 1</option>
    <option>옵션 2</option>
  </select>

■ Checkbox
  클래스: checkbox
  색상: checkbox-primary, checkbox-secondary 등
  
  예시:
  <input type="checkbox" className="checkbox checkbox-primary" />

■ Radio
  클래스: radio
  색상: radio-primary, radio-secondary 등
  
  예시:
  <input type="radio" name="option" className="radio radio-primary" />

■ Toggle (스위치)
  클래스: toggle
  
  예시:
  <input type="checkbox" className="toggle toggle-primary" />


================================================================================
5. 카드 (Card) 스타일
================================================================================

■ 기본 Card
  클래스: card bg-base-200 shadow-xl
  속성:
    - 배경: #3B4252
    - 그림자: shadow-xl
    - 둥근 모서리: border-radius: 1rem
  
  구조:
  <div className="card bg-base-200 shadow-xl">
    <div className="card-body">
      <h2 className="card-title">제목</h2>
      <p>내용</p>
      <div className="card-actions justify-end">
        <button className="btn btn-primary">액션</button>
      </div>
    </div>
  </div>

■ Card 변형

1) 이미지가 있는 Card
   <div className="card bg-base-200 shadow-xl">
     <figure><img src="..." alt="..." /></figure>
     <div className="card-body">...</div>
   </div>

2) Compact Card
   클래스: card-compact
   패딩 축소

3) Side Card (가로형)
   클래스: card card-side
   이미지와 내용이 가로로 배치


================================================================================
6. Badge (뱃지) 스타일
================================================================================

■ 기본 Badge
  클래스: badge
  크기: 작은 라벨 형태
  
  예시: <div className="badge">기본</div>

■ Badge 색상
  - badge-primary: 주요 (#5E81AC)
  - badge-secondary: 보조 (#81A1C1)
  - badge-accent: 강조 (#88C0D0)
  - badge-success: 성공 (#A3BE8C)
  - badge-warning: 경고 (#EBCB8B)
  - badge-error: 오류 (#BF616A)
  - badge-neutral: 중립 (회색)

■ Badge 크기
  - badge-sm: 작은 크기
  - badge: 기본 크기
  - badge-lg: 큰 크기

■ Outline Badge
  클래스: badge badge-outline
  투명 배경에 테두리만

예시: <div className="badge badge-primary badge-lg">1</div>


================================================================================
7. Alert (알림) 스타일
================================================================================

■ 기본 Alert
  클래스: alert
  
  구조:
  <div className="alert">
    <svg>...</svg>
    <span>알림 메시지</span>
  </div>

■ Alert 유형
  - alert-info: 정보 (파란색)
  - alert-success: 성공 (초록색)
  - alert-warning: 경고 (노란색)
  - alert-error: 오류 (빨간색)

예시:
<div className="alert alert-success">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
  <span>성공적으로 저장되었습니다!</span>
</div>


================================================================================
8. Loading (로딩) 스타일
================================================================================

■ Spinner
  클래스: loading loading-spinner
  크기:
    - loading-xs: 매우 작음
    - loading-sm: 작음
    - loading-md: 중간 (기본)
    - loading-lg: 큼
  
  예시: <span className="loading loading-spinner loading-md"></span>

■ Dots
  클래스: loading loading-dots
  
  예시: <span className="loading loading-dots loading-lg"></span>

■ Ring
  클래스: loading loading-ring
  
  예시: <span className="loading loading-ring loading-lg"></span>


================================================================================
9. 그림자 (Shadow) 효과
================================================================================

■ 그림자 레벨
  - shadow-sm: 작은 그림자
  - shadow: 기본 그림자
  - shadow-md: 중간 그림자
  - shadow-lg: 큰 그림자
  - shadow-xl: 매우 큰 그림자
  - shadow-2xl: 초대형 그림자

■ 사용 지침
  - 카드: shadow-xl 또는 shadow-2xl
  - 버튼: shadow-lg, 호버 시 shadow-xl
  - 이미지: shadow-md
  - 모달/오버레이: shadow-2xl


================================================================================
10. 애니메이션 및 전환 효과
================================================================================

■ 전환 효과
  클래스: transition-all
  지속 시간: 0.2s ~ 0.3s
  
  예시:
  - hover:shadow-xl transition-all
  - hover:scale-105 transition-transform
  - hover:bg-base-300 transition-colors

■ Transform
  - scale-105: 5% 확대
  - scale-110: 10% 확대
  - scaleX(-1): 좌우 반전 (미러링)
  - rotate-6: 6도 회전

■ Group Hover (그룹 호버)
  부모에 group 클래스, 자식에 group-hover: 접두사
  
  예시:
  <div className="group">
    <img className="group-hover:scale-105 transition-transform" />
  </div>


================================================================================
11. 레이아웃 유틸리티
================================================================================

■ 간격 (Spacing)
  - p-4: 패딩 1rem (모든 방향)
  - px-6: 좌우 패딩 1.5rem
  - py-4: 상하 패딩 1rem
  - m-4: 마진 1rem
  - gap-4: Grid/Flex 요소 간 간격 1rem

■ 반응형 Breakpoints
  - sm: 640px 이상
  - md: 768px 이상
  - lg: 1024px 이상
  - xl: 1280px 이상
  - 2xl: 1536px 이상

  예시: md:grid-cols-2 lg:grid-cols-4

■ Grid
  - grid: Grid 컨테이너
  - grid-cols-2: 2열 그리드
  - grid-cols-3: 3열 그리드
  - gap-4: 요소 간 간격

■ Flex
  - flex: Flexbox 컨테이너
  - justify-center: 가로 중앙 정렬
  - items-center: 세로 중앙 정렬
  - flex-col: 세로 방향
  - gap-4: 요소 간 간격


================================================================================
12. 접근성 (Accessibility) 가이드
================================================================================

■ 색상 대비
  - 텍스트와 배경 간 대비비 최소 4.5:1 준수
  - 큰 텍스트(18pt 이상)는 3:1 이상

■ 포커스 상태
  - 모든 상호작용 요소에 focus:outline 또는 focus:ring 적용
  - 키보드 네비게이션 지원

■ Alt Text
  - 모든 이미지에 의미 있는 alt 속성 제공
  - 장식용 이미지는 alt="" (빈 문자열)

■ ARIA Labels
  - 버튼에는 명확한 텍스트 또는 aria-label
  - 아이콘 전용 버튼: aria-label="설명" 필수


================================================================================
13. Weather 4 Cuts 특화 컴포넌트
================================================================================

■ 카메라 프레임
  - 최대 너비: 500px
  - 최대 높이: 70vh
  - 둥근 모서리: rounded-xl
  - 그림자: shadow-lg
  - 오버플로우: overflow-hidden

■ 사진 그리드
  - 레이아웃: grid-cols-2 (2열)
  - 간격: gap-4
  - 카드 스타일: rounded-lg shadow-md

■ 프로그레스 뱃지
  - 위치: 하단 중앙 (absolute bottom-4)
  - 크기: badge-lg
  - 배경: badge-neutral
  - 그림자: shadow-lg

■ 빈 프레임 슬롯
  - 배경: bg-base-200
  - 테두리: border-2 border-dashed border-base-content/20
  - 아이콘: 카메라 SVG (h-12 w-12)
  - 호버: hover:bg-base-300 transition-colors


================================================================================
14. 코드 예시
================================================================================

■ 촬영 버튼
<button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all gap-2">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
  촬영하기 (0/4)
</button>

■ 사진 카드
<div className="card bg-base-100 shadow-2xl">
  <div className="card-body">
    <h3 className="card-title text-2xl justify-center mb-6">
      <span className="text-primary">📷</span>
      촬영된 사진
      <div className="badge badge-primary badge-lg">4/4</div>
    </h3>
    <div className="grid grid-cols-2 gap-4">
      {/* 사진 목록 */}
    </div>
  </div>
</div>

■ 로딩 버튼
<button className="btn btn-success btn-lg" disabled>
  <span className="loading loading-spinner loading-md"></span>
  저장 중...
</button>

■ 빈 프레임
<div className="aspect-3/4 bg-base-200 rounded-lg border-2 border-dashed border-base-content/20 flex flex-col items-center justify-center gap-2">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93..." />
  </svg>
  <span className="text-base-content/40 text-lg font-semibold">1</span>
</div>


================================================================================
15. Material Icons
================================================================================

■ 개요
  - Weather 4 Cuts에서는 Google Material Icons를 사용합니다
  - 일관된 디자인 언어와 접근성을 제공합니다
  - React 컴포넌트로 쉽게 통합 가능합니다

■ 설치
  npm install @mui/icons-material @mui/material @emotion/react @emotion/styled

■ 기본 사용법
  import HomeIcon from '@mui/icons-material/Home';
  import CameraAltIcon from '@mui/icons-material/CameraAlt';
  
  <HomeIcon className="h-5 w-5" />
  <CameraAltIcon fontSize="small" />

■ 크기 설정
  - fontSize prop 사용:
    * fontSize="small"  → 20px
    * fontSize="medium" → 24px (기본값)
    * fontSize="large"  → 35px
    
  - Tailwind 클래스 사용:
    * className="h-4 w-4" → 16px
    * className="h-5 w-5" → 20px
    * className="h-6 w-6" → 24px
    * className="h-8 w-8" → 32px

■ 프로젝트에서 사용하는 주요 아이콘

  [네비게이션]
  - HomeIcon: 홈 버튼
  - ArrowBackIcon: 뒤로가기

  [촬영 관련]
  - CameraAltIcon: 카메라/촬영 버튼
  - RestartAltIcon: 다시 촬영
  - CheckCircleIcon: 촬영 완료
  - PhotoCameraIcon: 사진 촬영

  [액션]
  - DownloadIcon: 다운로드
  - EditIcon: 수정
  - DeleteIcon: 삭제
  - SaveIcon: 저장
  - CloseIcon: 닫기/취소

  [날씨]
  - WbSunnyIcon: 맑음
  - CloudIcon: 흐림
  - UmbrellaIcon: 비
  - AcUnitIcon: 눈

  [상태]
  - PhotoLibraryIcon: 갤러리/사진 목록
  - ImageIcon: 이미지 플레이스홀더
  - ErrorIcon: 에러
  - WarningIcon: 경고

■ daisyUI 버튼과 함께 사용
  <button className="btn btn-primary gap-2">
    <CameraAltIcon fontSize="small" />
    촬영하기
  </button>

  <button className="btn btn-success btn-lg gap-2">
    <DownloadIcon className="h-6 w-6" />
    다운로드
  </button>

  <button className="btn btn-ghost gap-2">
    <EditIcon fontSize="small" />
    수정
  </button>

■ 색상 적용
  - sx prop 사용:
    <HomeIcon sx={{ color: '#5E81AC' }} />
  
  - Tailwind 클래스:
    <HomeIcon className="text-primary" />
    <CameraAltIcon className="text-success" />
    <ErrorIcon className="text-error" />

■ 반응형 아이콘
  <CameraAltIcon className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />

■ 접근성
  - aria-label과 함께 사용:
    <button aria-label="홈으로 가기">
      <HomeIcon />
    </button>
  
  - title prop 사용:
    <DeleteIcon titleAccess="삭제" />


================================================================================
16. 반응형 디자인 규칙
================================================================================

■ 모바일 우선 (Mobile First)
  - 기본 스타일은 모바일 기준
  - 더 큰 화면용 스타일은 브레이크포인트 접두사 사용

■ 주요 브레이크포인트 전략
  - 모바일 (기본): 단일 열, 큰 버튼, 전체 너비
  - 태블릿 (md:): 2열 그리드, 중간 크기 요소
  - 데스크탑 (lg:): 3~4열 그리드, 사이드바 레이아웃

■ 터치 타겟
  - 최소 크기: 44x44px
  - 버튼 간 간격: 최소 8px (gap-2)

■ 뷰포트 단위
  - 카메라 프레임: max-height: 70vh
  - 전체 화면: min-h-screen


================================================================================
17. 성능 최적화
================================================================================

■ CSS 클래스 최적화
  - 필요한 클래스만 사용
  - Tailwind CSS의 PurgeCSS로 미사용 클래스 제거

■ 이미지 최적화
  - 적절한 크기로 리사이징
  - WebP 포맷 사용 권장

■ 애니메이션
  - transform과 opacity만 애니메이션 (GPU 가속)
  - transition-all 대신 구체적 속성 지정 (성능 중요 시)


================================================================================
18. 일관성 체크리스트
================================================================================

□ 모든 버튼에 적절한 크기(btn-sm, btn, btn-lg) 적용
□ 주요 액션은 btn-primary, 완료는 btn-success 사용
□ 카드는 bg-base-200 shadow-xl로 통일
□ 간격은 4의 배수(p-4, gap-4, mb-4) 사용
□ 모든 이미지에 rounded-lg 이상 적용
□ 호버 효과에 transition 추가
□ 텍스트 색상은 text-base-content 또는 변형 사용
□ Badge는 의미에 맞는 색상 사용
□ 로딩 상태는 loading-spinner와 함께 표시
□ 아이콘과 텍스트는 gap-2로 간격 유지


================================================================================
19. 참고 자료
================================================================================

■ 공식 문서
  - daisyUI: https://daisyui.com/
  - Tailwind CSS: https://tailwindcss.com/
  - Nord Theme: https://www.nordtheme.com/
  - Material Icons: https://mui.com/material-ui/material-icons/

■ 컴포넌트 예시
  - daisyUI Components: https://daisyui.com/components/
  - Tailwind UI: https://tailwindui.com/

■ 색상 도구
  - Nord Color Palette: https://www.nordtheme.com/docs/colors-and-palettes


================================================================================
작성자: GitHub Copilot
프로젝트: Weather 4 Cuts
라이선스: MIT
================================================================================
