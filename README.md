# 단국대학교 소프트웨어학과 기록 서비스

## 운영 방안

일단은 Repository에 과제물 및 수업 내용에 대한 산출물을 올린다.

## 서비스 개발 아이디어 노트

산출물을 이용하여 어떤 식으로 서비스를 만들지에 대한 아이디어를 생각 날 때 마다 기록한다.

- GitHub API를 이용하여 다른 사람의 Repository에 있는 README.md 파일을 읽어오는 방식으로 포스팅 한다.
- 회원가입/로그인은 무조건 GitHub Authorization을 이용한다.
- GitHub Follow, Star 등을 연동한다.
- GitHub Repository와 Post를 연동한다
- 댓글은 Utterances를 이용한다.

Repository 연동 방법

- 사용자는 서비스에 등록할 Repository를 만든다.
- frontmatter 문법으로 title, date, category 등의 정보를 입력할 수 있다.
- Observing에 대한 방안
  - 방안1 : batch나 scheduling을 통해 repository를 observing 하여 지속적으로 변경 내역을 읽어온다.
  - 방안2 : 사용자가 hook을 등록하면 commit시 repository의 변경 내역을 읽어온다.

기타 제공 서비스

- Repository star
- User Following, Follower
- User Repository total star
- hottest repository
- hottest user
- 주간 commit 랭킹
- 일일 commit 랭킹