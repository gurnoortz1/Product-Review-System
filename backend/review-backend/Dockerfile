FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY ["pom.xml", "."]
COPY [".mvn", ".mvn"]
COPY ["mvnw", "."]
COPY ["mvnw.cmd", "."]
COPY ["src", "src"]

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build ["/app/target/review-0.0.1-SNAPSHOT.jar", "app.jar"]

RUN mkdir -p /app/data

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
