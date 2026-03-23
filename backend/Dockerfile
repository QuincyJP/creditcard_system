# Use Java 17
FROM eclipse-temurin:17-jdk

# Copy jar file
COPY target/*.jar app.jar

# Run the app
ENTRYPOINT ["java","-jar","/app.jar"]